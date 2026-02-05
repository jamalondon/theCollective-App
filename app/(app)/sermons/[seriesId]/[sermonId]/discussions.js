import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Icon from '../../../../../src/components/Icon';
import { SPACING } from '../../../../../src/constants/theme';
import { useTheme } from '../../../../../src/hooks/useThemedStyles';
import { selectTheme } from '../../../../../src/store/themeSlice';
import { pressableOpacityStyle } from '../../../../../src/utils/pressableOpacityStyle';

const { FontAwesome6 } = Icon;

export default function SermonDiscussions() {
	const { sermonId, seriesId } = useLocalSearchParams();
	const router = useRouter();
	const { colors } = useTheme();
	const insets = useSafeAreaInsets();
	const { isDarkMode } = useSelector(selectTheme);

	// Placeholder discussions data
	const [discussions] = useState([
		{
			id: '1',
			title: 'What are the main takeaways?',
			count: 12,
			latest: 'Just now',
		},
		{
			id: '2',
			title: 'How can we apply this to our lives?',
			count: 8,
			latest: '2 hours ago',
		},
		{
			id: '3',
			title: 'Questions about the scripture references',
			count: 5,
			latest: '1 day ago',
		},
	]);

	const handleDiscussionPress = (discussionId) => {
		router.push({
			pathname: `/sermons/${seriesId}/${sermonId}/forum`,
			params: { discussionId },
		});
	};

	const DiscussionCard = ({ discussion }) => (
		<Pressable
			style={({ pressed }) => [
				styles.card,
				{
					backgroundColor: colors.card ?? colors.surface,
					borderColor:
						colors.border?.default ?? (isDarkMode ? '#2D2D2D' : '#E5E5E5'),
					opacity: pressableOpacityStyle(pressed),
				},
			]}
			onPress={() => handleDiscussionPress(discussion.id)}
		>
			<View style={styles.cardContent}>
				<Text style={[styles.title, { color: colors.text.primary }]}>
					{discussion.title}
				</Text>
				<View style={styles.footer}>
					<Text style={{ color: colors.text.tertiary, fontSize: 12 }}>
						<FontAwesome6
							name="comments"
							size={12}
							color={colors.text.tertiary}
						/>{' '}
						{discussion.count} {discussion.count === 1 ? 'comment' : 'comments'}
					</Text>
					<Text style={{ color: colors.text.tertiary, fontSize: 12 }}>
						{discussion.latest}
					</Text>
				</View>
			</View>
			<View>
				<FontAwesome6
					name="chevron-right"
					size={16}
					color={colors.text.tertiary}
				/>
			</View>
		</Pressable>
	);

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<FlatList
				data={discussions}
				renderItem={({ item }) => <DiscussionCard discussion={item} />}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					paddingHorizontal: SPACING.lg,
					paddingVertical: SPACING.lg,
					paddingBottom: insets.bottom + SPACING.xl,
				}}
				ListEmptyComponent={() => (
					<View style={{ padding: SPACING.lg, alignItems: 'center' }}>
						<Text style={{ color: colors.text.secondary }}>
							No discussions yet. Start one!
						</Text>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: SPACING.md,
		paddingVertical: SPACING.md,
		marginBottom: SPACING.md,
		borderRadius: 12,
		borderWidth: 1,
	},
	cardContent: { flex: 1, marginRight: SPACING.md },
	title: { fontSize: 16, fontWeight: '600', marginBottom: SPACING.xs },
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: SPACING.xs,
	},
});
