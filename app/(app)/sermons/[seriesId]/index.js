import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FeedSkeleton from '../../../../src/components/FeedSkeleton';
import { useTheme } from '../../../../src/hooks/useThemedStyles';
import { fetchSermons } from '../../../../src/store/sermonThunk';

export default function SeriesDetail() {
	const { seriesId } = useLocalSearchParams();
	const dispatch = useDispatch();
	const router = useRouter();
	const { colors } = useTheme();
	const insets = useSafeAreaInsets();
	const { sermons, loading } = useSelector((s) => s.sermons || {});

	useEffect(() => {
		if (seriesId) {
			dispatch(fetchSermons());
		}
	}, [dispatch, seriesId]);

	if (loading && !sermons) {
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

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: colors.background, paddingTop: insets.top },
			]}
		>
			<Text>Sermons Screen</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	title: { fontSize: 20, fontWeight: '700' },
});
