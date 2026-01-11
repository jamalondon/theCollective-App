import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	RefreshControl,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../src/components/Icon';
import { useFormatAgeOfDate } from '../../src/hooks/useFormatAgeOfDate';
import { useTheme, useThemedStyles } from '../../src/hooks/useThemedStyles';
import { clearSelectedEvent } from '../../src/store/eventSlice';
import {
	addEventComment,
	attendEvent,
	cancelAttendance,
	deleteEventComment,
	getEventById,
	getEventComments,
	likeEvent,
	unlikeEvent,
} from '../../src/store/eventThunk';
import { pressableOpacityStyle } from '../../src/utils/pressableOpacityStyle';

export default function EventDetail() {
	const { id } = useLocalSearchParams();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const { eventDetailStyles: styles } = useThemedStyles();
	const insets = useSafeAreaInsets();
	const formatAgeOfDate = useFormatAgeOfDate();

	const { selectedEvent, isLoading, error, comments, commentsLoading } =
		useSelector((state) => state.events);
	const { userID } = useSelector((state) => state.user);

	const [refreshing, setRefreshing] = useState(false);
	const [joiningEvent, setJoiningEvent] = useState(false);
	const [likingEvent, setLikingEvent] = useState(false);
	const [commentText, setCommentText] = useState('');
	const [submitting, setSubmitting] = useState(false);

	// Fetch event and comments on mount
	useEffect(() => {
		if (id) {
			dispatch(getEventById(id));
			dispatch(getEventComments(id));
		}

		return () => {
			dispatch(clearSelectedEvent());
		};
	}, [id, dispatch]);

	// Handle pull-to-refresh
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await Promise.all([
			dispatch(getEventById(id)),
			dispatch(getEventComments(id)),
		]);
		setRefreshing(false);
	}, [id, dispatch]);

	// Check if current user is attending
	const isAttending = selectedEvent?.attendees?.some(
		(attendee) => attendee.id === userID || attendee.user_id === userID
	);

	const eventLikeCount = selectedEvent?.likeCount ?? 0;
	const eventLikedByUser = Boolean(selectedEvent?.likedByUser);

	const handleToggleLike = async () => {
		if (likingEvent) return;
		setLikingEvent(true);
		try {
			const result = dispatch(
				eventLikedByUser ? unlikeEvent(id) : likeEvent(id)
			);
			if (typeof result.unwrap === 'function') await result.unwrap();
			else await result;
		} catch (error) {
			console.error('Failed to toggle event like:', error);
		} finally {
			setLikingEvent(false);
		}
	};

	// Handle submit comment
	const handleSubmitComment = async () => {
		if (!commentText.trim() || submitting) return;

		setSubmitting(true);
		try {
			await dispatch(
				addEventComment({ eventId: id, text: commentText.trim() })
			).unwrap();
			setCommentText('');
			Keyboard.dismiss();
		} catch (error) {
			console.error('Failed to add comment:', error);
		} finally {
			setSubmitting(false);
		}
	};

	// Handle delete comment
	const handleDeleteComment = (commentId) => {
		Alert.alert('Delete', 'Are you sure you want to delete this comment?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				onPress: async () => {
					setSubmitting(true);
					try {
						await dispatch(deleteEventComment({ eventId: id, commentId }));
					} catch (error) {
						console.error('Failed to delete comment:', error);
					} finally {
						setSubmitting(false);
					}
				},
			},
		]);
	};

	// Handle join/leave event
	const handleJoinLeave = async () => {
		if (joiningEvent) return;

		setJoiningEvent(true);
		try {
			if (isAttending) {
				await dispatch(cancelAttendance(id)).unwrap();
			} else {
				await dispatch(attendEvent(id)).unwrap();
			}
		} catch (error) {
			console.error('Failed to update attendance:', error);
		} finally {
			setJoiningEvent(false);
		}
	};

	// Format date
	const formatDate = (dateString) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric',
			});
		} catch (_error) {
			return dateString;
		}
	};

	// Format time
	const formatTime = (dateString) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
			});
		} catch (_error) {
			return '';
		}
	};

	// Loading state
	if (isLoading && !selectedEvent) {
		return (
			<View
				style={[
					styles.container,
					styles.loadingContainer,
					{ paddingTop: insets.top },
				]}
			>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	// Error state
	if (error && !selectedEvent) {
		return (
			<View
				style={[
					styles.container,
					styles.errorContainer,
					{ paddingTop: insets.top },
				]}
			>
				<Pressable
					onPress={() => router.back()}
					style={pressableOpacityStyle({ style: styles.header })}
				>
					<Icon.IoniconsIcon
						name="arrow-back"
						size={28}
						color={colors.primary}
					/>
				</Pressable>
				<Text style={styles.errorText}>{error.message}</Text>
			</View>
		);
	}

	if (!selectedEvent) {
		return null;
	}

	const attendees = selectedEvent.attendees || [];

	const formatLocation = (location) => {
		if (!location) return '';
		if (typeof location === 'string') return location;
		if (typeof location === 'object') {
			const parts = [
				location.name + '\n',
				location.address,
				location.city,
				location.state,
			].filter(Boolean);
			return parts.join(' ');
		}
		return String(location);
	};

	const locationLabel = formatLocation(selectedEvent.location);

	// Render attendee item for horizontal FlatList
	const renderAttendee = ({ item: attendee, index }) => (
		<View key={attendee.id || index} style={styles.attendeeItem}>
			<Image
				source={{ uri: attendee.profile_picture }}
				style={styles.attendeeProfilePic}
			/>
			<Text style={styles.attendeeName} numberOfLines={1}>
				{attendee.name ||
					`${attendee.firstName || ''} ${attendee.lastName || ''}`.trim()}
			</Text>
		</View>
	);

	// Render header (event content + attendees)
	const renderHeader = () => (
		<View>
			{/* Type Tag */}
			<View style={styles.titleContainer}>
				<View style={styles.typeTag}>
					<Text style={styles.typeTagText}>EVENT</Text>
				</View>

				{/* Title */}
				<Text style={styles.title}>{selectedEvent.title}</Text>
			</View>

			{/* Meta Information */}
			<View style={styles.metaContainer}>
				{/* Date */}
				<View style={styles.metaRow}>
					<Icon.IoniconsIcon
						name="calendar-outline"
						size={20}
						color={colors.text.secondary}
						style={styles.metaIcon}
					/>
					<Text style={styles.metaText}>{formatDate(selectedEvent.date)}</Text>
				</View>

				{/* Time */}
				<View style={styles.metaRow}>
					<Icon.IoniconsIcon
						name="time-outline"
						size={20}
						color={colors.text.secondary}
						style={styles.metaIcon}
					/>
					<Text style={styles.metaText}>{formatTime(selectedEvent.date)}</Text>
				</View>

				{/* Location */}
				{locationLabel ? (
					<View style={styles.metaRow}>
						<Icon.IoniconsIcon
							name="location-outline"
							size={20}
							color={colors.text.secondary}
							style={styles.metaIcon}
						/>
						<Text style={styles.metaText}>{locationLabel}</Text>
					</View>
				) : null}
			</View>

			{/* Join/Leave Button */}
			<View style={styles.joinButtonContainer}>
				<Pressable
					onPress={handleJoinLeave}
					disabled={joiningEvent}
					style={pressableOpacityStyle({
						style: [styles.joinButton, isAttending && styles.leaveButton],
						disabled: joiningEvent,
					})}
				>
					{joiningEvent ? (
						<ActivityIndicator
							size="small"
							color={isAttending ? colors.text.primary : colors.text.button}
						/>
					) : (
						<Text
							style={[
								styles.joinButtonText,
								isAttending && styles.leaveButtonText,
							]}
						>
							{isAttending ? 'Leave Event' : 'Join Event'}
						</Text>
					)}
				</Pressable>
			</View>

			{/* Like Button */}
			<View style={styles.actionsRow}>
				<Pressable
					onPress={handleToggleLike}
					disabled={likingEvent}
					style={pressableOpacityStyle({
						style: [
							styles.actionPill,
							eventLikedByUser && styles.actionPillActive,
						],
						disabled: likingEvent,
						activeOpacity: 0.7,
					})}
				>
					{likingEvent ? (
						<ActivityIndicator
							size="small"
							color={
								eventLikedByUser
									? colors.postTypes.event.tagText
									: colors.text.secondary
							}
						/>
					) : (
						<Icon.IoniconsIcon
							name={eventLikedByUser ? 'heart' : 'heart-outline'}
							size={18}
							color={
								eventLikedByUser
									? colors.postTypes.event.tagText
									: colors.text.secondary
							}
						/>
					)}
					<Text
						style={[
							styles.actionPillText,
							eventLikedByUser && styles.actionPillTextActive,
						]}
					>
						{eventLikeCount}
					</Text>
				</Pressable>
			</View>

			{/* Divider */}
			<View style={styles.divider} />

			{/* Description */}
			<View style={styles.descriptionContainer}>
				<Text style={styles.sectionTitle}>About this Event</Text>
				<Text style={styles.descriptionText}>{selectedEvent.description}</Text>
			</View>

			{/* Divider */}
			<View style={styles.divider} />

			{/* Attendees Section */}
			<View style={styles.attendeesSection}>
				<View style={styles.attendeesHeader}>
					<Text style={styles.sectionTitle}>Attendees</Text>
					<Text style={styles.attendeeCount}>
						{attendees.length} {attendees.length === 1 ? 'person' : 'people'}
					</Text>
				</View>

				{attendees.length > 0 ? (
					<FlatList
						data={attendees}
						renderItem={renderAttendee}
						keyExtractor={(item, index) => item.id || index.toString()}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.attendeesList}
					/>
				) : (
					<Text style={styles.emptyAttendees}>
						Be the first to join this event!
					</Text>
				)}
			</View>

			{/* Divider */}
			<View style={styles.divider} />

			{/* Comments Section Header */}
			<View style={styles.commentsSection}>
				<View style={styles.commentsHeader}>
					<Text style={styles.sectionTitle}>Comments</Text>
					{comments.length > 0 && (
						<Text style={styles.commentCount}>
							{comments.length} {comments.length === 1 ? 'comment' : 'comments'}
						</Text>
					)}
				</View>
			</View>
		</View>
	);

	// Render comment item
	const renderComment = ({ item: comment }) => {
		const user = comment.user || {};

		return (
			<View style={[styles.commentItem, { marginHorizontal: 16 }]}>
				<Image
					source={{ uri: user.profile_picture }}
					style={styles.commentProfilePic}
				/>
				<View style={styles.commentContent}>
					<Text style={styles.commentAuthor}>{user.name || 'Unknown'}</Text>
					<Text style={styles.commentText}>{comment.text}</Text>

					<Text style={styles.commentDate}>
						{formatAgeOfDate(comment.created_at)}
					</Text>
				</View>
				{user.id === userID && (
					<Pressable
						onPress={() => handleDeleteComment(comment.id)}
						style={pressableOpacityStyle({ style: styles.deleteButton })}
					>
						<Icon.IoniconsIcon
							name="trash"
							size={20}
							color={colors.text.secondary}
						/>
					</Pressable>
				)}
			</View>
		);
	};

	// Render empty comments
	const renderEmptyComments = () => {
		if (commentsLoading) {
			return (
				<ActivityIndicator
					size="small"
					color={colors.primary}
					style={{ marginTop: 16 }}
				/>
			);
		}

		return (
			<Text style={styles.emptyComments}>Be the first to leave a comment!</Text>
		);
	};

	return (
		<KeyboardAvoidingView
			style={[styles.container, { paddingTop: insets.top }]}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			{/* Header with Back Button */}
			<View style={styles.header}>
				<Pressable
					onPress={() => router.back()}
					style={pressableOpacityStyle({ style: null })}
				>
					<Icon.IoniconsIcon
						name="arrow-back"
						size={28}
						color={colors.primary}
					/>
				</Pressable>
			</View>

			<FlatList
				data={comments}
				renderItem={renderComment}
				keyExtractor={(item) => item.id}
				ListHeaderComponent={renderHeader}
				ListEmptyComponent={renderEmptyComments}
				contentContainerStyle={styles.scrollContent}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={colors.primary}
						colors={[colors.primary]}
					/>
				}
				showsVerticalScrollIndicator={false}
			/>

			{/* Comment Input */}
			<View
				style={[
					styles.commentInputContainer,
					{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
				]}
			>
				<TextInput
					style={styles.commentInput}
					placeholder="Add a comment..."
					placeholderTextColor={colors.text.secondary}
					value={commentText}
					onChangeText={setCommentText}
					multiline
					maxLength={500}
				/>
				<Pressable
					onPress={handleSubmitComment}
					disabled={!commentText.trim() || submitting}
					style={pressableOpacityStyle({
						style: [
							styles.sendButton,
							(!commentText.trim() || submitting) && styles.sendButtonDisabled,
						],
						disabled: !commentText.trim() || submitting,
					})}
				>
					<Icon.IoniconsIcon name="send" size={20} color={colors.text.button} />
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	);
}
