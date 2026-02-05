import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FeedSkeleton from '../../../src/components/FeedSkeleton';
import SermonSeriesCard from '../../../src/components/SermonSeriesCard';
import FilterDropdown from '../../../src/components/ui/FilterDropdown';
import { FONTS, SPACING } from '../../../src/constants/theme';
import { useTheme } from '../../../src/hooks/useThemedStyles';
import { fetchSeries } from '../../../src/store/sermonThunk';

const FILTER_OPTIONS = [
	{ label: 'Current Series', value: 'current' },
	{ label: 'Upcoming Series', value: 'upcoming' },
	{ label: 'Past Series', value: 'past' },
];

export default function SermonsIndex() {
	const dispatch = useDispatch();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { colors } = useTheme();
	const [selectedFilter, setSelectedFilter] = useState('current');

	const {
		current = [],
		upcoming = [],
		past = [],
		loading,
		error,
	} = useSelector((s) => s.sermons || {});

	useEffect(() => {
		dispatch(fetchSeries());
	}, [dispatch]);

	const openSeries = (id) => router.push(`/sermons/${id}`);

	// Get the data based on selected filter
	const getFilteredData = () => {
		switch (selectedFilter) {
			case 'current':
				return current;
			case 'upcoming':
				return upcoming;
			case 'past':
				return past;
			default:
				return [];
		}
	};

	const filteredData = getFilteredData();

	// Get empty state message
	const getEmptyMessage = () => {
		switch (selectedFilter) {
			case 'current':
				return 'No current sermon series';
			case 'upcoming':
				return 'No upcoming sermon series';
			case 'past':
				return 'No past sermon series';
			default:
				return 'No sermon series';
		}
	};

	if (
		loading &&
		current.length === 0 &&
		upcoming.length === 0 &&
		past.length === 0
	) {
		return (
			<View
				style={[
					styles.container,
					{ backgroundColor: colors.background, paddingTop: insets.top },
				]}
			>
				<FeedSkeleton count={4} />
			</View>
		);
	}

	const renderItem = ({ item }) => {
		if (!item || !item.id) {
			console.error('Invalid series data:', item);
			return null;
		}
		return (
			<SermonSeriesCard series={item} onPress={() => openSeries(item.id)} />
		);
	};

	const renderEmpty = () => (
		<View style={styles.emptyContainer}>
			<Text style={[styles.emptyText, { color: colors.text.secondary }]}>
				{getEmptyMessage()}
			</Text>
		</View>
	);

	const renderHeader = () => (
		<View
			style={[
				styles.headerContainer,
				{
					paddingTop: insets.top + SPACING.lg,
				},
			]}
		>
			<FilterDropdown
				value={selectedFilter}
				onValueChange={setSelectedFilter}
				options={FILTER_OPTIONS}
			/>
		</View>
	);

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<FlatList
				data={filteredData}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				ListHeaderComponent={renderHeader}
				ListEmptyComponent={renderEmpty}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: insets.bottom + SPACING.xl,
				}}
				pagingEnabled
				snapToAlignment="start"
				decelerationRate="fast"
			/>
			{error ? (
				<View style={styles.errorContainer}>
					<Text style={{ color: colors.text.negative }}>{error}</Text>
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	headerContainer: {
		alignItems: 'center',
		paddingBottom: SPACING.lg,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: SPACING.xxxl * 3,
	},
	emptyText: {
		fontSize: FONTS.sizes.lg,
		fontWeight: FONTS.weights.medium,
	},
	errorContainer: {
		position: 'absolute',
		bottom: SPACING.xl,
		left: SPACING.lg,
		right: SPACING.lg,
		padding: SPACING.md,
	},
});
