import { router } from 'expo-router';
import React from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FONTS, SPACING } from '../constants/theme';
import { useTheme } from '../hooks/useThemedStyles';
import { deleteEvent, likeEvent, unlikeEvent } from '../store/eventThunk';
import {
	deletePrayerRequest,
	likePrayerRequest,
	unlikePrayerRequest,
} from '../store/prayerRequestThunk';
import { pressableOpacityStyle } from '../utils/pressableOpacityStyle';
import Icon from './Icon';

const FeedCard = ({ item, style }) => {
	const dispatch = useDispatch();
	const userID = useSelector((state) => state.user.userID);
	const { isDarkMode } = useSelector((state) => state.theme);
	const { colors } = useTheme();
	const isEvent = item.type === 'event';
	const isPrayerRequest = item.type === 'prayer_request';
	const [likeSubmitting, setLikeSubmitting] = React.useState(false);
	const isAnonymousPrayerRequest = Boolean(isPrayerRequest && item.anonymous);

	const handlePress = () => {
		if (isEvent) {
			// Navigate to event detail page
			router.push(`/event/${item.id}`);
		} else if (isPrayerRequest) {
			// Navigate to prayer request detail page
			router.push(`/prayer-request/${item.id}`);
		}
	};

	const handleDelete = () => {
		//show confirmation dialog
		Alert.alert('Delete', 'Are you sure you want to delete this item?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				onPress: () => {
					if (isEvent) {
						dispatch(deleteEvent(item.id));
					} else if (isPrayerRequest) {
						dispatch(deletePrayerRequest(item.id));
					}
				},
			},
		]);
	};

	// Format date
	const formatDate = (dateString) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		} catch (_error) {
			return dateString;
		}
	};

	// Format time for events
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

	// Truncate text with ellipsis
	const truncateText = (text, maxLength = 150) => {
		if (!text) return '';
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength).trim() + '...';
	};

	// Likes (from API)
	const likeCount = item.likeCount ?? 0;
	const likedByUser = Boolean(item.likedByUser);

	const getOwnerDisplayName = (owner) => {
		if (!owner) return '';
		return owner.name || '';
	};

	const getOwnerAvatarUri = (owner) => {
		if (!owner) return '';
		return owner.profile_picture || '';
	};

	const getInitials = (name) => {
		if (!name) return '?';
		const parts = String(name).trim().split(/\s+/).filter(Boolean);
		if (parts.length === 0) return '?';
		if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	};

	const formatLocation = (location) => {
		if (!location) return '';
		if (typeof location === 'string') return location;
		if (typeof location === 'object') {
			return (
				location.name || location.address || location.formatted_address || ''
			);
		}
		return String(location);
	};

	const owner = item?.owner;
	const ownerName = getOwnerDisplayName(owner);
	const ownerAvatarUri = !isAnonymousPrayerRequest
		? getOwnerAvatarUri(owner)
		: '';
	const displayName = isAnonymousPrayerRequest
		? 'Anonymous'
		: ownerName || 'Someone';
	const initials = getInitials(displayName);
	const locationLabel = formatLocation(item.location);

	const handleToggleLike = async () => {
		if (likeSubmitting) return;
		setLikeSubmitting(true);
		try {
			if (isEvent) {
				const result = dispatch(
					likedByUser ? unlikeEvent(item.id) : likeEvent(item.id)
				);
				if (typeof result.unwrap === 'function') await result.unwrap();
				else await result;
			} else if (isPrayerRequest) {
				const result = dispatch(
					likedByUser
						? unlikePrayerRequest(item.id)
						: likePrayerRequest(item.id)
				);
				if (typeof result.unwrap === 'function') await result.unwrap();
				else await result;
			}
		} catch (error) {
			// Don’t block navigation; just log for now
			console.error('Failed to toggle like:', error);
		} finally {
			setLikeSubmitting(false);
		}
	};

	return (
		<Pressable
			onPress={handlePress}
			style={pressableOpacityStyle({
				style: [styles.container, { backgroundColor: colors.card }, style],
				activeOpacity: 0.7,
			})}
		>
			{/* Left accent border */}
			<View style={[styles.accentBorder]} />

			{/* Content */}
			<View style={styles.content}>
				{/* header */}
				<View style={styles.header}>
					{/* type tag */}
					<View
						style={[
							styles.typeTag,
							{ backgroundColor: isDarkMode ? 'white' : 'black' },
						]}
					>
						<Text
							style={[
								styles.typeTagText,
								{ color: isDarkMode ? 'black' : 'white' },
							]}
						>
							{isEvent ? 'EVENT' : 'PRAYER REQUEST'}
						</Text>
					</View>

					{/* delete button */}
					{/* only delete if it is the current user's item */}
					{item?.owner?.id === userID && (
						<Pressable
							onPress={handleDelete}
							style={pressableOpacityStyle({ style: styles.deleteButton })}
						>
							<Icon.IoniconsIcon
								name="trash"
								size={24}
								color={colors.text.secondary}
							/>
						</Pressable>
					)}
				</View>

				{/* Author */}
				<View style={styles.authorRow}>
					<View
						style={[
							styles.avatar,
							{
								backgroundColor: colors.surface,
								borderColor: colors.border.default,
							},
						]}
					>
						{ownerAvatarUri ? (
							<Image
								source={{ uri: ownerAvatarUri }}
								style={styles.avatarImage}
								resizeMode="cover"
							/>
						) : (
							<Text
								style={[
									styles.avatarInitials,
									{ color: colors.text.secondary },
								]}
							>
								{initials}
							</Text>
						)}
					</View>
					<Text
						style={[styles.authorName, { color: colors.text.secondary }]}
						numberOfLines={1}
					>
						{displayName}
					</Text>
				</View>

				{/* Title */}
				<Text
					style={[styles.title, { color: colors.text.primary }]}
					numberOfLines={2}
				>
					{item.title}
				</Text>

				{/* Description/Text */}
				<Text
					style={[styles.description, { color: colors.text.secondary }]}
					numberOfLines={3}
				>
					{truncateText(item.description || item.text)}
				</Text>

				{/* Meta information */}
				<View style={styles.metaContainer}>
					{/* Date/Time */}
					<View style={styles.metaItem}>
						<Text style={[styles.metaText, { color: colors.text.secondary }]}>
							{formatDate(item.date || item.created_at)}
							{isEvent && item.date && ` • ${formatTime(item.date)}`}
						</Text>
					</View>

					{/* Location for events */}
					{isEvent && locationLabel ? (
						<View style={styles.metaItem}>
							<Text
								style={[styles.metaText, { color: colors.text.secondary }]}
								numberOfLines={1}
							>
								📍 {locationLabel}
							</Text>
						</View>
					) : null}

					{/* Anonymous indicator for prayer requests */}
					{isPrayerRequest && item.anonymous && (
						<View style={styles.metaItem}>
							<Text style={[styles.metaText, { color: colors.text.secondary }]}>
								🙏 Anonymous
							</Text>
						</View>
					)}
				</View>

				{/* Actions */}
				<View style={styles.actionsRow}>
					<Pressable
						onPress={handleToggleLike}
						disabled={likeSubmitting}
						style={pressableOpacityStyle({
							style: [styles.actionButton, { backgroundColor: colors.surface }],
							disabled: likeSubmitting,
							activeOpacity: 0.7,
						})}
					>
						{likeSubmitting ? (
							<ActivityIndicator
								size="small"
								color={likedByUser ? 'red' : colors.text.secondary}
							/>
						) : (
							<Icon.IoniconsIcon
								name={likedByUser ? 'heart' : 'heart-outline'}
								size={18}
								color={likedByUser ? 'red' : colors.text.secondary}
							/>
						)}
						<Text
							style={[
								styles.actionText,
								{
									color: likedByUser ? 'red' : colors.text.secondary,
								},
							]}
						>
							{likeCount}
						</Text>
					</Pressable>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderRadius: 12,
		marginHorizontal: SPACING.lg,
		marginVertical: SPACING.sm,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	deleteButton: {
		padding: SPACING.xs,
	},
	accentBorder: {
		width: 4,
	},
	content: {
		flex: 1,
		padding: SPACING.lg,
	},
	authorRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: SPACING.sm,
		marginBottom: SPACING.sm,
	},
	avatar: {
		width: 28,
		height: 28,
		borderRadius: 14,
		overflow: 'hidden',
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarImage: {
		width: '100%',
		height: '100%',
	},
	avatarInitials: {
		fontSize: FONTS.sizes.xs,
		fontWeight: FONTS.weights.semibold,
	},
	authorName: {
		flex: 1,
		fontSize: FONTS.sizes.sm,
		fontWeight: FONTS.weights.medium,
	},
	typeTag: {
		alignSelf: 'flex-start',
		paddingHorizontal: SPACING.sm,
		paddingVertical: SPACING.xs,
		borderRadius: 4,
		marginBottom: SPACING.sm,
	},
	typeTagText: {
		fontSize: FONTS.sizes.xs,
		fontWeight: FONTS.weights.semibold,
		letterSpacing: 0.5,
	},
	title: {
		fontSize: FONTS.sizes.lg,
		fontWeight: FONTS.weights.bold,
		marginBottom: SPACING.sm,
		lineHeight: 24,
	},
	description: {
		fontSize: FONTS.sizes.sm,
		lineHeight: 20,
		marginBottom: SPACING.md,
	},
	metaContainer: {
		gap: SPACING.xs,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	metaText: {
		fontSize: FONTS.sizes.xs,
		fontWeight: FONTS.weights.regular,
	},
	actionsRow: {
		flexDirection: 'row',
		marginTop: SPACING.md,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		paddingHorizontal: SPACING.md,
		paddingVertical: SPACING.sm,
		borderRadius: 999,
		gap: SPACING.xs,
	},
	actionText: {
		fontSize: FONTS.sizes.sm,
		fontWeight: FONTS.weights.semibold,
	},
});

export default FeedCard;
