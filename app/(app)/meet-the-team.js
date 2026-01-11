import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Pressable,
	RefreshControl,
	SectionList,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import ServerAPI from '../../src/API/ServerAPI';
import { FONTS, SPACING } from '../../src/constants/theme';
import { selectTheme } from '../../src/store/themeSlice';
import { pressableOpacityStyle } from '../../src/utils/pressableOpacityStyle';

// Role configuration with display names and icons
const ROLE_CONFIG = {
	developer: {
		title: 'Developers',
		icon: 'code',
		order: 1,
	},
	leader: {
		title: 'Leaders',
		icon: 'crown',
		order: 2,
	},
	user: {
		title: 'Members',
		icon: 'people-group',
		order: 3,
	},
};

// Friendship status types
const FRIENDSHIP_STATUS = {
	NONE: 'none',
	PENDING_SENT: 'pending_sent', // Current user sent the request
	PENDING_RECEIVED: 'pending_received', // Current user received the request
	ACCEPTED: 'accepted',
	SELF: 'self',
};

export default function MeetTheTeamScreen() {
	const { colors } = useSelector(selectTheme);
	const { token, userID } = useSelector((state) => state.user);
	const styles = createStyles(colors);

	// Local state for users - not stored in Redux
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState('');

	// Friendship data
	const [friends, setFriends] = useState(new Set()); // Set of friend user IDs
	const [sentRequests, setSentRequests] = useState(new Map()); // Map of userId -> friendshipId
	const [receivedRequests, setReceivedRequests] = useState(new Map()); // Map of userId -> friendshipId
	const [processingRequests, setProcessingRequests] = useState(new Set()); // Currently processing

	// Fetch friends list
	const fetchFriends = useCallback(async () => {
		try {
			const response = await ServerAPI.get('/users/friends?limit=100', {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.data.success) {
				const friendIds = new Set(
					response.data.data.map((friend) => friend.id)
				);
				setFriends(friendIds);
			}
		} catch (err) {
			console.error('Error fetching friends:', err);
		}
	}, [token]);

	// Fetch sent friend requests
	const fetchSentRequests = useCallback(async () => {
		try {
			const response = await ServerAPI.get(
				'/users/friends/requests/sent?limit=100',
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				const sentMap = new Map();
				response.data.data.forEach((request) => {
					sentMap.set(request.addressee_id, request.id);
				});
				setSentRequests(sentMap);
			}
		} catch (err) {
			console.error('Error fetching sent requests:', err);
		}
	}, [token]);

	// Fetch received (pending) friend requests
	const fetchReceivedRequests = useCallback(async () => {
		try {
			const response = await ServerAPI.get(
				'/users/friends/requests/pending?limit=100',
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				const receivedMap = new Map();
				response.data.data.forEach((request) => {
					receivedMap.set(request.requester_id, request.id);
				});
				setReceivedRequests(receivedMap);
			}
		} catch (err) {
			console.error('Error fetching received requests:', err);
		}
	}, [token]);

	// Fetch all users from the API
	const fetchUsers = useCallback(async () => {
		try {
			const response = await ServerAPI.get('/users/all-users?limit=100', {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.data.success) {
				setUsers(response.data.data);
			} else {
				setError('Failed to load users');
			}
		} catch (err) {
			console.error('Error fetching users:', err);
			setError(err.response?.data?.message || 'Failed to load users');
		}
	}, [token]);

	// Fetch all data
	const fetchAllData = useCallback(
		async (isRefresh = false) => {
			try {
				if (isRefresh) {
					setRefreshing(true);
				} else {
					setLoading(true);
				}
				setError('');

				// Fetch all data in parallel
				await Promise.all([
					fetchUsers(),
					fetchFriends(),
					fetchSentRequests(),
					fetchReceivedRequests(),
				]);
			} catch (err) {
				console.error('Error fetching data:', err);
				setError('Failed to load data');
			} finally {
				setLoading(false);
				setRefreshing(false);
			}
		},
		[fetchUsers, fetchFriends, fetchSentRequests, fetchReceivedRequests]
	);

	// Fetch data when screen comes into focus
	useFocusEffect(
		useCallback(() => {
			fetchAllData();
		}, [fetchAllData])
	);

	// Get friendship status for a user
	const getFriendshipStatus = useCallback(
		(userId) => {
			if (userId === userID) return FRIENDSHIP_STATUS.SELF;
			if (friends.has(userId)) return FRIENDSHIP_STATUS.ACCEPTED;
			if (sentRequests.has(userId)) return FRIENDSHIP_STATUS.PENDING_SENT;
			if (receivedRequests.has(userId))
				return FRIENDSHIP_STATUS.PENDING_RECEIVED;
			return FRIENDSHIP_STATUS.NONE;
		},
		[userID, friends, sentRequests, receivedRequests]
	);

	// Group users by role
	const groupUsersByRole = useCallback(() => {
		const grouped = {};

		users.forEach((user) => {
			const role = user.role || 'user';
			if (!grouped[role]) {
				grouped[role] = [];
			}
			grouped[role].push(user);
		});

		// Convert to sections array and sort by role order
		const sections = Object.entries(grouped)
			.map(([role, data]) => ({
				title: ROLE_CONFIG[role]?.title || 'Other',
				icon: ROLE_CONFIG[role]?.icon || 'person',
				order: ROLE_CONFIG[role]?.order || 99,
				data,
			}))
			.sort((a, b) => a.order - b.order);

		return sections;
	}, [users]);

	// Handle sending friend request
	const handleSendFriendRequest = async (targetUserId) => {
		try {
			setProcessingRequests((prev) => new Set([...prev, targetUserId]));

			const response = await ServerAPI.post(
				'/users/friends/request',
				{ userId: targetUserId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				// Check if auto-accepted (mutual request)
				if (response.data.data.status === 'accepted') {
					setFriends((prev) => new Set([...prev, targetUserId]));
					setReceivedRequests((prev) => {
						const newMap = new Map(prev);
						newMap.delete(targetUserId);
						return newMap;
					});
				} else {
					// Add to sent requests
					setSentRequests((prev) => {
						const newMap = new Map(prev);
						newMap.set(targetUserId, response.data.data.id);
						return newMap;
					});
				}
			}
		} catch (err) {
			console.error('Error sending friend request:', err);
		} finally {
			setProcessingRequests((prev) => {
				const newSet = new Set(prev);
				newSet.delete(targetUserId);
				return newSet;
			});
		}
	};

	// Handle accepting friend request
	const handleAcceptRequest = async (targetUserId) => {
		const friendshipId = receivedRequests.get(targetUserId);
		if (!friendshipId) return;

		try {
			setProcessingRequests((prev) => new Set([...prev, targetUserId]));

			const response = await ServerAPI.patch(
				`/users/friends/request/${friendshipId}/accept`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				// Add to friends and remove from received requests
				setFriends((prev) => new Set([...prev, targetUserId]));
				setReceivedRequests((prev) => {
					const newMap = new Map(prev);
					newMap.delete(targetUserId);
					return newMap;
				});
			}
		} catch (err) {
			console.error('Error accepting friend request:', err);
		} finally {
			setProcessingRequests((prev) => {
				const newSet = new Set(prev);
				newSet.delete(targetUserId);
				return newSet;
			});
		}
	};

	// Handle canceling sent friend request
	const handleCancelRequest = async (targetUserId) => {
		const friendshipId = sentRequests.get(targetUserId);
		if (!friendshipId) return;

		try {
			setProcessingRequests((prev) => new Set([...prev, targetUserId]));

			const response = await ServerAPI.delete(
				`/users/friends/request/${friendshipId}/cancel`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				setSentRequests((prev) => {
					const newMap = new Map(prev);
					newMap.delete(targetUserId);
					return newMap;
				});
			}
		} catch (err) {
			console.error('Error canceling friend request:', err);
		} finally {
			setProcessingRequests((prev) => {
				const newSet = new Set(prev);
				newSet.delete(targetUserId);
				return newSet;
			});
		}
	};

	// Render action button based on friendship status
	const renderActionButton = (userId) => {
		const status = getFriendshipStatus(userId);
		const isProcessing = processingRequests.has(userId);

		if (status === FRIENDSHIP_STATUS.SELF) {
			return (
				<View style={styles.youBadge}>
					<Text style={styles.youBadgeText}>You</Text>
				</View>
			);
		}

		if (isProcessing) {
			return (
				<View style={styles.actionButton}>
					<ActivityIndicator size="small" color={colors.primary} />
				</View>
			);
		}

		switch (status) {
			case FRIENDSHIP_STATUS.ACCEPTED:
				return (
					<View style={styles.friendsBadge}>
						<Ionicons
							name="checkmark-circle"
							size={16}
							color={colors.success}
						/>
						<Text style={styles.friendsBadgeText}>Friends</Text>
					</View>
				);

			case FRIENDSHIP_STATUS.PENDING_SENT:
				return (
					<Pressable
						onPress={() => handleCancelRequest(userId)}
						style={pressableOpacityStyle({ style: styles.pendingButton })}
					>
						<Ionicons
							name="time-outline"
							size={16}
							color={colors.text.secondary}
						/>
						<Text style={styles.pendingButtonText}>Pending</Text>
					</Pressable>
				);

			case FRIENDSHIP_STATUS.PENDING_RECEIVED:
				return (
					<Pressable
						onPress={() => handleAcceptRequest(userId)}
						style={pressableOpacityStyle({ style: styles.acceptButton })}
					>
						<Ionicons name="checkmark" size={18} color={colors.text.button} />
						<Text style={styles.acceptButtonText}>Accept</Text>
					</Pressable>
				);

			default:
				return (
					<Pressable
						onPress={() => handleSendFriendRequest(userId)}
						style={pressableOpacityStyle({ style: styles.addButton })}
					>
						<Ionicons
							name="person-add-outline"
							size={18}
							color={colors.primary}
						/>
						<Text style={styles.addButtonText}>Add</Text>
					</Pressable>
				);
		}
	};

	// Render individual user card
	const renderUserCard = ({ item }) => {
		return (
			<View style={styles.userCard}>
				<View style={styles.userInfo}>
					{item.profile_picture ? (
						<Image
							source={{ uri: item.profile_picture }}
							style={styles.profilePicture}
						/>
					) : (
						<View style={styles.profilePicturePlaceholder}>
							<Ionicons name="person" size={24} color={colors.text.secondary} />
						</View>
					)}
					<View style={styles.userTextInfo}>
						<Text style={styles.userName} numberOfLines={1}>
							{item.name || item.full_name || item.username || 'Unknown User'}
						</Text>
						{item.username && (
							<Text style={styles.userUsername} numberOfLines={1}>
								@{item.username}
							</Text>
						)}
					</View>
				</View>

				{renderActionButton(item.id)}
			</View>
		);
	};

	// Render section header
	const renderSectionHeader = ({ section }) => (
		<View style={styles.sectionHeader}>
			<FontAwesome6
				name={section.icon}
				size={20}
				color={colors.text.primary}
				style={styles.sectionIcon}
			/>
			<Text style={styles.sectionTitle}>{section.title}</Text>
			<View style={styles.sectionBadge}>
				<Text style={styles.sectionBadgeText}>{section.data.length}</Text>
			</View>
		</View>
	);

	// Render empty component
	const renderEmpty = () => (
		<View style={styles.emptyContainer}>
			<Ionicons name="people-outline" size={64} color={colors.text.secondary} />
			<Text style={styles.emptyText}>No users found</Text>
		</View>
	);

	// Loading state
	if (loading && !refreshing) {
		return (
			<SafeAreaView style={styles.container} edges={['top']}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Get Connected</Text>
				</View>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</SafeAreaView>
		);
	}

	// Error state
	if (error && users.length === 0) {
		return (
			<SafeAreaView style={styles.container} edges={['top']}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Get Connected</Text>
				</View>
				<View style={styles.errorContainer}>
					<Ionicons
						name="alert-circle-outline"
						size={64}
						color={colors.error}
					/>
					<Text style={styles.errorText}>{error}</Text>
					<Pressable
						onPress={() => fetchAllData()}
						style={pressableOpacityStyle({ style: styles.retryButton })}
					>
						<Text style={styles.retryButtonText}>Retry</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		);
	}

	const sections = groupUsersByRole();

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Get Connected</Text>
				<Text style={styles.headerSubtitle}>
					{users.length} {users.length === 1 ? 'member' : 'members'} •{' '}
					{friends.size} {friends.size === 1 ? 'friend' : 'friends'}
				</Text>
			</View>

			<SectionList
				sections={sections}
				keyExtractor={(item) => item.id}
				renderItem={renderUserCard}
				renderSectionHeader={renderSectionHeader}
				ListEmptyComponent={renderEmpty}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
				stickySectionHeadersEnabled={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() => fetchAllData(true)}
						tintColor={colors.primary}
						colors={[colors.primary]}
					/>
				}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				SectionSeparatorComponent={() => (
					<View style={styles.sectionSeparator} />
				)}
			/>
		</SafeAreaView>
	);
}

const createStyles = (colors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		header: {
			paddingHorizontal: SPACING.lg,
			paddingTop: SPACING.lg,
			paddingBottom: SPACING.md,
			borderBottomWidth: 1,
			borderBottomColor: colors.border.default,
		},
		headerTitle: {
			fontSize: FONTS.sizes.xl,
			fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
		},
		headerSubtitle: {
			fontSize: FONTS.sizes.sm,
			color: colors.text.secondary,
			marginTop: SPACING.xs,
		},
		listContent: {
			paddingBottom: SPACING.xxxl,
		},
		sectionHeader: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
			backgroundColor: colors.surface,
		},
		sectionIcon: {
			marginRight: SPACING.sm,
		},
		sectionTitle: {
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.primary,
			flex: 1,
		},
		sectionBadge: {
			backgroundColor: colors.primary,
			borderRadius: 12,
			paddingHorizontal: SPACING.sm,
			paddingVertical: 2,
			minWidth: 24,
			alignItems: 'center',
		},
		sectionBadgeText: {
			fontSize: FONTS.sizes.xs,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.button,
		},
		sectionSeparator: {
			height: SPACING.md,
		},
		separator: {
			height: 1,
			backgroundColor: colors.border.default,
			marginLeft: SPACING.lg + 50 + SPACING.md,
		},
		userCard: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
			backgroundColor: colors.card,
		},
		userInfo: {
			flexDirection: 'row',
			alignItems: 'center',
			flex: 1,
		},
		profilePicture: {
			width: 100,
			height: 100,
			borderRadius: 25,
			backgroundColor: colors.surface,
		},
		profilePicturePlaceholder: {
			width: 50,
			height: 50,
			borderRadius: 25,
			backgroundColor: colors.surface,
			justifyContent: 'center',
			alignItems: 'center',
		},
		userTextInfo: {
			marginLeft: SPACING.md,
			flex: 1,
		},
		userName: {
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.primary,
		},
		userUsername: {
			fontSize: FONTS.sizes.sm,
			color: colors.text.secondary,
			marginTop: 2,
		},
		// Action buttons
		actionButton: {
			paddingVertical: SPACING.sm,
			paddingHorizontal: SPACING.md,
			minWidth: 80,
			alignItems: 'center',
			justifyContent: 'center',
		},
		addButton: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: SPACING.sm,
			paddingHorizontal: SPACING.md,
			borderRadius: SPACING.lg,
			borderWidth: 1,
			borderColor: colors.primary,
			backgroundColor: 'transparent',
		},
		addButtonText: {
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.semibold,
			color: colors.primary,
			marginLeft: SPACING.xs,
		},
		acceptButton: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: SPACING.sm,
			paddingHorizontal: SPACING.md,
			borderRadius: SPACING.lg,
			backgroundColor: colors.primary,
		},
		acceptButtonText: {
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.button,
			marginLeft: SPACING.xs,
		},
		pendingButton: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: SPACING.sm,
			paddingHorizontal: SPACING.md,
			borderRadius: SPACING.lg,
			borderWidth: 1,
			borderColor: colors.border.default,
			backgroundColor: 'transparent',
		},
		pendingButtonText: {
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.medium,
			color: colors.text.secondary,
			marginLeft: SPACING.xs,
		},
		friendsBadge: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: SPACING.sm,
			paddingHorizontal: SPACING.md,
			borderRadius: SPACING.lg,
			backgroundColor: colors.surface,
		},
		friendsBadgeText: {
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.medium,
			color: colors.success,
			marginLeft: SPACING.xs,
		},
		youBadge: {
			paddingVertical: SPACING.xs,
			paddingHorizontal: SPACING.md,
			borderRadius: SPACING.lg,
			backgroundColor: colors.surface,
		},
		youBadgeText: {
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.medium,
			color: colors.text.secondary,
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		errorContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: SPACING.xl,
		},
		errorText: {
			fontSize: FONTS.sizes.md,
			color: colors.error,
			textAlign: 'center',
			marginTop: SPACING.lg,
			marginBottom: SPACING.lg,
		},
		retryButton: {
			backgroundColor: colors.primary,
			paddingVertical: SPACING.md,
			paddingHorizontal: SPACING.xl,
			borderRadius: SPACING.md,
		},
		retryButtonText: {
			color: colors.text.button,
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
		},
		emptyContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			paddingVertical: SPACING.xxxl * 2,
		},
		emptyText: {
			fontSize: FONTS.sizes.md,
			color: colors.text.secondary,
			marginTop: SPACING.lg,
		},
	});
