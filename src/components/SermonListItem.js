import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FONTS, SPACING } from '../constants/theme';
import { useTheme } from '../hooks/useThemedStyles';
import { pressableOpacityStyle } from '../utils/pressableOpacityStyle';

export default function SermonListItem({ sermon, onPress }) {
	const { colors } = useTheme();
	return (
		<Pressable
			onPress={onPress}
			style={pressableOpacityStyle({
				style: [
					styles.container,
					{ borderColor: colors.border.default, backgroundColor: colors.card },
				],
				activeOpacity: 0.9,
			})}
		>
			<View style={styles.body}>
				<Text
					style={[styles.title, { color: colors.text.primary }]}
					numberOfLines={2}
				>
					{sermon.title}
				</Text>
				{sermon.summary ? (
					<Text
						style={[styles.summary, { color: colors.text.secondary }]}
						numberOfLines={2}
					>
						{sermon.summary}
					</Text>
				) : null}
			</View>
			<View style={styles.meta}>
				{sermon.speakers && sermon.speakers.length > 0 ? (
					<Text style={[styles.speaker, { color: colors.text.tertiary }]}>
						{sermon.speakers[0].name || sermon.speakers[0].user_id || 'Speaker'}
					</Text>
				) : sermon.speaker ? (
					<Text style={[styles.speaker, { color: colors.text.tertiary }]}>
						{sermon.speaker}
					</Text>
				) : null}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: SPACING.md,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center',
		marginVertical: SPACING.xs,
	},
	body: { flex: 1 },
	title: {
		fontSize: FONTS.sizes.md,
		fontWeight: FONTS.weights.semibold,
		marginBottom: SPACING.xs,
	},
	summary: { fontSize: FONTS.sizes.sm },
	meta: { marginLeft: SPACING.md },
	speaker: { fontSize: FONTS.sizes.sm },
});
