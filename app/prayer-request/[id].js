import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Pressable,
	Platform,
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
import { clearSelectedPrayerRequest } from '../../src/store/prayerRequestSlice';
import {
	addComment,
	deleteComment,
	getComments,
	getPrayerRequestById,
	likePrayerRequest,
	unlikePrayerRequest,
} from '../../src/store/prayerRequestThunk';
import { pressableOpacityStyle } from '../../src/utils/pressableOpacityStyle';

export default function PrayerRequestDetail() {
	const { id } = useLocalSearchParams();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const { prayerRequestDetailStyles: styles } = useThemedStyles();
	const insets = useSafeAreaInsets();
	const formatAgeOfDate = useFormatAgeOfDate();

	const { selectedPrayerRequest, isLoading, error, comments, commentsLoading } =
		useSelector((state) => state.prayerRequests);
	const { userID } = useSelector((state) => state.user);

	const [refreshing, setRefreshing] = useState(false);
	const [commentText, setCommentText] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [likingPrayerRequest, setLikingPrayerRequest] = useState(false);

	// Fetch prayer request and comments on mount
	useEffect(() => {
		if (id) {
			dispatch(getPrayerRequestById(id));
			dispatch(getComments(id));
		}

		return () => {
			dispatch(clearSelectedPrayerRequest());
		};
	}, [id, dispatch]);

	// Handle pull-to-refresh
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await Promise.all([
			dispatch(getPrayerRequestById(id)),
			dispatch(getComments(id)),
		]);
		setRefreshing(false);
	}, [id, dispatch]);

	// Format date
	const formatDate = (dateString) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
			});
		} catch (_error) {
			return dateString;
		}
	};

	// Handle comment submission
	const handleSubmitComment = async () => {
		if (!commentText.trim() || submitting) return;

		setSubmitting(true);
		try {
			await dispatch(
				addComment({ prayerRequestId: id, text: commentText.trim() })
			).unwrap();
			setCommentText('');
			//dismiss keyboard
			Keyboard.dismiss();
		} catch (error) {
			console.error('Failed to add comment:', error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeleteComment = (commentId) => {
		Alert.alert('Delete', 'Are you sure you want to delete this comment?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				onPress: async () => {
					setSubmitting(true);
					try {
						await dispatch(deleteComment({ prayerRequestId: id, commentId }));
					} catch (error) {
						console.error('Failed to delete comment:', error);
					} finally {
						setSubmitting(false);
					}
				},
			},
		]);
	};

	// Render header (prayer request content)
	const renderHeader = () => {
		if (!selectedPrayerRequest) return null;

		const owner = selectedPrayerRequest.owner || {};
		const prayerLikeCount = selectedPrayerRequest.likeCount ?? 0;
		const prayerLikedByUser = Boolean(selectedPrayerRequest.likedByUser);

		const handleToggleLike = async () => {
			if (likingPrayerRequest) return;
			setLikingPrayerRequest(true);
			try {
				const result = dispatch(
					prayerLikedByUser ? unlikePrayerRequest(id) : likePrayerRequest(id)
				);
				if (typeof result.unwrap === 'function') await result.unwrap();
				else await result;
			} catch (error) {
				console.error('Failed to toggle prayer request like:', error);
			} finally {
				setLikingPrayerRequest(false);
			}
		};

		return (
			<View>
				{/* Type Tag */}
				<View style={styles.titleContainer}>
					{/* Title */}
					<Text style={styles.title}>{selectedPrayerRequest.title}</Text>
				</View>

				{/* User Info Row */}
				<View style={styles.userInfoRow}>
					<Image
						source={{ uri: owner.profile_picture }}
						style={styles.profilePicture}
					/>
					<View style={styles.userInfoText}>
						<Text style={styles.userName}>{owner.name}</Text>
						<Text style={styles.dateText}>
							{formatDate(selectedPrayerRequest.created_at)}
						</Text>
					</View>
				</View>

				{/* Content */}
				<View style={styles.contentContainer}>
					<Text style={styles.contentText}>{selectedPrayerRequest.text}</Text>
				</View>

				{/* Like Button */}
				<View style={styles.actionsRow}>
					<Pressable
						onPress={handleToggleLike}
						disabled={likingPrayerRequest}
						style={pressableOpacityStyle({
							style: [
								styles.actionPill,
								prayerLikedByUser && styles.actionPillActive,
							],
							disabled: likingPrayerRequest,
							activeOpacity: 0.7,
						})}
					>
						{likingPrayerRequest ? (
							<ActivityIndicator
								size="small"
								color={
									prayerLikedByUser
										? colors.postTypes.prayerRequest.tagText
										: colors.text.secondary
								}
							/>
						) : (
							<Icon.IoniconsIcon
								name={prayerLikedByUser ? 'heart' : 'heart-outline'}
								size={18}
								color={
									prayerLikedByUser
										? colors.postTypes.prayerRequest.tagText
										: colors.text.secondary
								}
							/>
						)}
						<Text
							style={[
								styles.actionPillText,
								prayerLikedByUser && styles.actionPillTextActive,
							]}
						>
							{prayerLikeCount}
						</Text>
					</Pressable>
				</View>

				{/* Photos */}
				{selectedPrayerRequest.photos &&
					selectedPrayerRequest.photos.length > 0 && (
						<View style={styles.photosContainer}>
							{selectedPrayerRequest.photos.map((photo, index) => (
								<Image
									key={index}
									source={{ uri: photo }}
									style={styles.photo}
									resizeMode="contain"
								/>
							))}
						</View>
					)}

				{/* Divider */}
				<View style={styles.divider} />

				{/* Comments Section Title */}
				<View style={styles.commentsSection}>
					<Text style={styles.commentsSectionTitle}>
						Comments {comments.length > 0 ? `(${comments.length})` : ''}
					</Text>
				</View>
			</View>
		);
	};

	// Render comment item
	const renderComment = ({ item }) => {
		const user = item.user || {};

		return (
			<View style={[styles.commentItem, { marginHorizontal: 16 }]}>
				<Image
					source={{ uri: user.profile_picture }}
					style={styles.commentProfilePic}
				/>
				<View style={styles.commentContent}>
					<Text style={styles.commentUserName}>{user.name}</Text>
					<Text style={styles.commentText}>{item.text}</Text>
					<Text style={styles.commentDate}>
						{formatAgeOfDate(item.created_at)}
					</Text>
				</View>
				{user.id === userID && (
					<Pressable
						onPress={() => handleDeleteComment(item.id)}
						style={pressableOpacityStyle({ style: null })}
					>
						<Icon.IoniconsIcon
							name="trash"
							size={24}
							color={colors.text.secondary}
						/>
					</Pressable>
				)}
			</View>
		);
	};

	// Render empty comments
	const renderEmptyComments = () => {
		if (commentsLoading) return null;

		return (
			<Text style={styles.emptyComments}>
				Be the first to offer words of encouragement
			</Text>
		);
	};

	// Loading state
	if (isLoading && !selectedPrayerRequest) {
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
	if (error && !selectedPrayerRequest) {
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
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}
	return (
		<KeyboardAvoidingView
			style={[styles.container, { paddingTop: insets.top }]}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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

			{/* Content */}
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
					{submitting ? (
						<ActivityIndicator size="small" color={colors.text.button} />
					) : (
						<Icon.IoniconsIcon
							name="send"
							size={20}
							color={colors.text.button}
						/>
					)}
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	);
}
