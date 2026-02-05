import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import {
	Animated,
	FlatList,
	Modal,
	Pressable,
	RefreshControl,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FeedCard from '../../src/components/FeedCard';
import FeedSkeleton from '../../src/components/FeedSkeleton';
import Icon from '../../src/components/Icon';
import { FONTS, SPACING } from '../../src/constants/theme';
import { useTheme } from '../../src/hooks/useThemedStyles';
import { populateDefaultLocations } from '../../src/store/eventThunk';
import { getNewsFeed } from '../../src/store/userThunk';
import { pressableOpacityStyle } from '../../src/utils/pressableOpacityStyle';

const { EntypoIcon, MaterialIcons } = Icon;

// Animated Feed Item Component
const AnimatedFeedItem = ({ item, index }) => {
	const animValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(animValue, {
			toValue: 1,
			duration: 400,
			delay: index * 100, // Stagger by 100ms
			useNativeDriver: true,
		}).start();
	}, [animValue, index]);

	return (
		<Animated.View
			style={{
				opacity: animValue,
				transform: [
					{
						translateY: animValue.interpolate({
							inputRange: [0, 1],
							outputRange: [20, 0],
						}),
					},
				],
			}}
		>
			<FeedCard item={item} />
		</Animated.View>
	);
};

export default function AppIndex() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { colors, isDarkMode } = useTheme();
	const insets = useSafeAreaInsets();
	const { newsFeed, newsFeedLoading, newsFeedError } = useSelector(
		(state) => state.user,
	);
	const [refreshing, setRefreshing] = React.useState(false);
	const [createMenuOpen, setCreateMenuOpen] = React.useState(false);

	// Fetch news feed on mount and default locations
	useEffect(() => {
		dispatch(getNewsFeed());
		dispatch(populateDefaultLocations());
	}, [dispatch]);

	// Handle pull-to-refresh
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await dispatch(getNewsFeed());
		setRefreshing(false);
	}, [dispatch]);

	// Sort feed by date (newest first)
	const sortedFeed = [...newsFeed].sort((a, b) => {
		const dateA = new Date(a.date || a.created_at);
		const dateB = new Date(b.date || b.created_at);
		return dateB - dateA;
	});

	// Render each feed item with animation
	const renderItem = ({ item, index }) => {
		return <AnimatedFeedItem item={item} index={index} />;
	};

	// Render header
	const renderHeader = () => (
		<View style={[styles.header, { paddingTop: insets.top + SPACING.lg }]}>
			<View style={styles.headerRow}>
				<View style={styles.headerText}>
					<Text style={[styles.headerTitle, { color: colors.text.primary }]}>
						News Feed
					</Text>
					<Text
						style={[styles.headerSubtitle, { color: colors.text.secondary }]}
					>
						Stay connected with your community
					</Text>
				</View>

				<Pressable
					onPress={() => setCreateMenuOpen(true)}
					style={pressableOpacityStyle({
						style: [
							styles.createButton,
							{
								backgroundColor: colors.card,
								borderColor: colors.border.default,
								shadowOpacity: isDarkMode ? 0.35 : 0.12,
							},
						],
						activeOpacity: 0.9,
					})}
				>
					<EntypoIcon name="plus" size={22} color={colors.text.primary} />
				</Pressable>
			</View>
		</View>
	);

	// Render empty state
	const renderEmptyState = () => {
		if (newsFeedLoading && !refreshing) {
			return null; // Skeleton will be shown instead
		}

		if (newsFeedError) {
			return (
				<View style={styles.emptyContainer}>
					<Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
						Oops! Something went wrong
					</Text>
					<Text style={[styles.emptyMessage, { color: colors.text.secondary }]}>
						{newsFeedError}
					</Text>
					<Text style={[styles.emptyHint, { color: colors.text.secondary }]}>
						Pull down to try again
					</Text>
				</View>
			);
		}

		return (
			<View style={styles.emptyContainer}>
				<Text style={[styles.emptyIcon]}>📰</Text>
				<Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
					No Posts Yet
				</Text>
				<Text style={[styles.emptyMessage, { color: colors.text.secondary }]}>
					Be the first to share an event or prayer request!
				</Text>
			</View>
		);
	};

	// Show skeleton while loading initially
	if (newsFeedLoading && !refreshing && newsFeed.length === 0) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<StatusBar
					barStyle={isDarkMode ? 'light-content' : 'dark-content'}
					backgroundColor={colors.background}
				/>
				<View style={{ paddingTop: insets.top }}>
					{renderHeader()}
					<FeedSkeleton count={5} />
				</View>
			</View>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<StatusBar
				barStyle={isDarkMode ? 'light-content' : 'dark-content'}
				backgroundColor={colors.background}
			/>
			<Modal
				visible={createMenuOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setCreateMenuOpen(false)}
			>
				<Pressable
					onPress={() => setCreateMenuOpen(false)}
					style={pressableOpacityStyle({
						style: styles.modalOverlay,
						activeOpacity: 1,
					})}
				>
					<View
						style={[
							styles.createMenu,
							{
								top: insets.top + 72,
								backgroundColor: colors.card,
								borderColor: colors.border.default,
								shadowOpacity: isDarkMode ? 0.45 : 0.12,
							},
						]}
					>
						<Pressable
							onPress={() => {
								setCreateMenuOpen(false);
								router.push('/createPrayerRequest');
							}}
							style={pressableOpacityStyle({
								style: styles.createMenuItem,
								activeOpacity: 0.85,
							})}
						>
							<MaterialIcons name="favorite" size={20} color={colors.primary} />
							<Text
								style={[
									styles.createMenuItemText,
									{ color: colors.text.primary },
								]}
							>
								Prayer Request
							</Text>
						</Pressable>

						<View
							style={[
								styles.createMenuDivider,
								{ backgroundColor: colors.border.default },
							]}
						/>

						<Pressable
							onPress={() => {
								setCreateMenuOpen(false);
								router.push('/createEvent');
							}}
							style={pressableOpacityStyle({
								style: styles.createMenuItem,
								activeOpacity: 0.85,
							})}
						>
							<EntypoIcon name="calendar" size={20} color={colors.primary} />
							<Text
								style={[
									styles.createMenuItemText,
									{ color: colors.text.primary },
								]}
							>
								Event
							</Text>
						</Pressable>
					</View>
				</Pressable>
			</Modal>
			<FlatList
				data={sortedFeed}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				ListHeaderComponent={renderHeader}
				ListEmptyComponent={renderEmptyState}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={colors.primary}
						colors={[colors.primary]}
						progressBackgroundColor={colors.card}
					/>
				}
				contentContainerStyle={
					sortedFeed.length === 0
						? styles.emptyContentContainer
						: [
								styles.contentContainer,
								{ paddingBottom: insets.bottom + SPACING.xl },
							]
				}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: SPACING.xl,
	},
	emptyContentContainer: {
		flexGrow: 1,
	},
	header: {
		paddingHorizontal: SPACING.lg,
		paddingBottom: SPACING.lg,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	headerText: {
		flex: 1,
		paddingRight: SPACING.md,
	},
	headerTitle: {
		fontSize: FONTS.sizes.xxl,
		fontWeight: FONTS.weights.bold,
		marginBottom: SPACING.xs,
	},
	headerSubtitle: {
		fontSize: FONTS.sizes.sm,
		fontWeight: FONTS.weights.regular,
	},
	createButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowRadius: 14,
		elevation: 10,
	},
	modalOverlay: {
		flex: 1,
	},
	createMenu: {
		position: 'absolute',
		right: SPACING.lg,
		borderRadius: 16,
		borderWidth: 1,
		paddingVertical: SPACING.sm,
		minWidth: 220,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 12 },
		shadowRadius: 18,
		elevation: 18,
	},
	createMenuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: SPACING.sm,
		paddingHorizontal: SPACING.lg,
		paddingVertical: 12,
	},
	createMenuItemText: {
		fontSize: FONTS.sizes.md,
		fontWeight: FONTS.weights.semibold,
	},
	createMenuDivider: {
		height: 1,
		marginHorizontal: SPACING.lg,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: SPACING.xxxl,
	},
	emptyIcon: {
		fontSize: 64,
		marginBottom: SPACING.lg,
	},
	emptyTitle: {
		fontSize: FONTS.sizes.xl,
		fontWeight: FONTS.weights.bold,
		marginBottom: SPACING.sm,
		textAlign: 'center',
	},
	emptyMessage: {
		fontSize: FONTS.sizes.md,
		textAlign: 'center',
		marginBottom: SPACING.xs,
	},
	emptyHint: {
		fontSize: FONTS.sizes.sm,
		textAlign: 'center',
		fontStyle: 'italic',
	},
});
