import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
	Alert,
	Dimensions,
	FlatList,
	ImageBackground,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import EditSeriesModal from '../../../../src/components/EditSeriesModal';
import FeedSkeleton from '../../../../src/components/FeedSkeleton';
import SermonCard from '../../../../src/components/SermonCard';
import { FONTS, SPACING } from '../../../../src/constants/theme';
import { useTheme } from '../../../../src/hooks/useThemedStyles';
import {
	fetchSeriesById,
	fetchSermonsForSeries,
} from '../../../../src/store/sermonThunk';
import { pressableOpacityStyle } from '../../../../src/utils/pressableOpacityStyle';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.45;

export default function SeriesDetail() {
	const { seriesId } = useLocalSearchParams();
	const dispatch = useDispatch();
	const router = useRouter();
	const { colors } = useTheme();
	const insets = useSafeAreaInsets();

	const {
		current,
		upcoming,
		past,
		selectedSeries,
		sermons: resolvedSermons,
		loading,
	} = useSelector((s) => s.sermons || {});
	const role = useSelector((s) => s.user.role);
	const canEdit = role === 'developer' || role === 'leader';

	const [editModalVisible, setEditModalVisible] = useState(false);

	// Look up series from categorized arrays first, fall back to selectedSeries
	const series = useMemo(() => {
		const all = [...(current || []), ...(upcoming || []), ...(past || [])];
		return all.find((s) => s.id === seriesId) || selectedSeries;
	}, [current, upcoming, past, seriesId, selectedSeries]);

	useEffect(() => {
		if (!series && seriesId) {
			dispatch(fetchSeriesById(seriesId));
		}
	}, [series, seriesId, dispatch]);

	// Fetch full sermon details when series is loaded
	useEffect(() => {
		if (series?.sermons?.length > 0) {
			const sermonIds = series.sermons.map((s) =>
				typeof s === 'string' ? s : s.id,
			);
			dispatch(fetchSermonsForSeries({ seriesId: series.id, sermonIds }));
		}
	}, [series?.id, series?.sermons, dispatch]);

	const handleAddSermon = () => {
		Alert.alert('Coming Soon', 'Adding sermons will be available soon.');
	};

	if (loading && !series) {
		return (
			<View
				style={[
					styles.container,
					{ backgroundColor: colors.background, paddingTop: insets.top },
				]}
			>
				<FeedSkeleton count={5} />
			</View>
		);
	}

	if (!series) {
		return (
			<View
				style={[
					styles.container,
					styles.centered,
					{ backgroundColor: colors.background, paddingTop: insets.top },
				]}
			>
				<Text
					style={{ color: colors.text.secondary, fontSize: FONTS.sizes.lg }}
				>
					Series not found
				</Text>
			</View>
		);
	}

	const imageSource = series.cover_image?.url
		? { uri: series.cover_image.url }
		: require('../../../../assets/images/default_sermon.jpg');

	const sermons =
		resolvedSermons?.length > 0 ? resolvedSermons : series.sermons || [];

	const renderHero = () => (
		<View>
			<ImageBackground
				source={imageSource}
				style={styles.heroImage}
				resizeMode="cover"
			>
				<LinearGradient
					colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
					style={styles.heroGradient}
				>
					{canEdit && (
						<Pressable
							onPress={() => setEditModalVisible(true)}
							style={pressableOpacityStyle({
								style: styles.editButton,
							})}
						>
							<Ionicons name="create-outline" size={22} color="#fff" />
						</Pressable>
					)}
					<View style={styles.heroContent}>
						<Text style={styles.heroTitle} numberOfLines={3}>
							{series.title || 'Untitled Series'}
						</Text>
						{series.description ? (
							<Text style={styles.heroDescription} numberOfLines={3}>
								{series.description}
							</Text>
						) : null}
						{series.start_date && series.end_date ? (
							<Text style={styles.heroDates}>
								{new Date(series.start_date).toLocaleDateString()} -{' '}
								{new Date(series.end_date).toLocaleDateString()}
							</Text>
						) : null}
					</View>
				</LinearGradient>
			</ImageBackground>

			{/* Sermons section header */}
			<View
				style={[
					styles.sectionHeader,
					{ borderBottomColor: colors.border.default },
				]}
			>
				<Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
					Sermons ({sermons.length})
				</Text>
				{canEdit && (
					<Pressable
						onPress={handleAddSermon}
						style={pressableOpacityStyle({
							style: styles.addButton,
						})}
					>
						<Ionicons
							name="add-circle-outline"
							size={22}
							color={colors.primary}
						/>
						<Text style={[styles.addButtonText, { color: colors.primary }]}>
							Add
						</Text>
					</Pressable>
				)}
			</View>
		</View>
	);

	const renderEmpty = () => (
		<View style={styles.emptyContainer}>
			<Ionicons
				name="musical-notes-outline"
				size={48}
				color={colors.text.secondary}
			/>
			<Text style={[styles.emptyText, { color: colors.text.secondary }]}>
				No sermons in this series yet
			</Text>
		</View>
	);

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<FlatList
				data={sermons}
				renderItem={({ item }) => (
					<SermonCard
						sermon={item}
						onPress={() => router.push(`/sermons/${seriesId}/${item.id}`)}
					/>
				)}
				keyExtractor={(item) => item.id}
				ListHeaderComponent={renderHero}
				ListEmptyComponent={renderEmpty}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: insets.bottom + SPACING.xl,
				}}
			/>

			<EditSeriesModal
				visible={editModalVisible}
				onClose={() => setEditModalVisible(false)}
				series={series}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	heroImage: {
		width: '100%',
		height: HERO_HEIGHT,
		backgroundColor: '#333',
	},
	heroGradient: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	heroContent: {
		padding: SPACING.xxxl,
		paddingBottom: SPACING.xxxl,
	},
	heroTitle: {
		fontSize: FONTS.sizes.xxl + 4,
		fontWeight: FONTS.weights.bold,
		color: '#FFFFFF',
		marginBottom: SPACING.md,
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 4,
	},
	heroDescription: {
		fontSize: FONTS.sizes.md,
		color: 'rgba(255, 255, 255, 0.85)',
		lineHeight: 22,
		marginBottom: SPACING.sm,
	},
	heroDates: {
		fontSize: FONTS.sizes.sm,
		color: 'rgba(255, 255, 255, 0.7)',
		marginTop: SPACING.xs,
	},
	editButton: {
		position: 'absolute',
		top: SPACING.xxxl + 44,
		right: SPACING.lg,
		backgroundColor: 'rgba(0,0,0,0.4)',
		borderRadius: 20,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: SPACING.lg,
		paddingVertical: SPACING.lg,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	sectionTitle: {
		fontSize: FONTS.sizes.lg,
		fontWeight: FONTS.weights.semibold,
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: SPACING.xs,
	},
	addButtonText: {
		fontSize: FONTS.sizes.md,
		fontWeight: FONTS.weights.medium,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: SPACING.xxxl * 3,
		gap: SPACING.md,
	},
	emptyText: {
		fontSize: FONTS.sizes.md,
		fontWeight: FONTS.weights.medium,
	},
});
