import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { FONTS, SPACING } from '../constants/theme';
import { useTheme } from '../hooks/useThemedStyles';
import { pressableOpacityStyle } from '../utils/pressableOpacityStyle';

export default function SermonCard({ sermon, onPress }) {
	const { colors } = useTheme();

	console.log('SermonCard - sermon:', sermon);
	const speakers =
		sermon.speakers
			?.map((s) => (typeof s === 'string' ? s : s.name))
			.join(', ') ||
		sermon.speaker ||
		'';

	return (
		<Pressable
			onPress={onPress}
			style={pressableOpacityStyle({
				style: [styles.container, { backgroundColor: colors.card }],
				activeOpacity: 0.95,
			})}
		>
			<LinearGradient
				colors={[colors.card, colors.surface]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.gradient}
			>
				<View style={styles.content}>
					<Text
						style={[styles.title, { color: colors.text.primary }]}
						numberOfLines={2}
					>
						{sermon.title || 'Untitled Sermon'}
					</Text>
					{sermon.summary ? (
						<Text
							style={[styles.summary, { color: colors.text.secondary }]}
							numberOfLines={2}
						>
							{sermon.summary}
						</Text>
					) : null}
					{speakers ? (
						<View style={styles.speakerRow}>
							<Ionicons
								name="person-outline"
								size={14}
								color={colors.text.secondary}
							/>
							<Text
								style={[styles.speaker, { color: colors.text.secondary }]}
								numberOfLines={1}
							>
								{speakers}
							</Text>
						</View>
					) : null}
				</View>
				<Ionicons
					name="chevron-forward"
					size={20}
					color={colors.text.secondary}
					style={styles.chevron}
				/>
			</LinearGradient>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: SPACING.lg,
		marginBottom: SPACING.md,
		borderRadius: 16,
		overflow: 'hidden',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 8,
			},
			android: {
				elevation: 4,
			},
		}),
	},
	gradient: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: SPACING.lg,
	},
	content: {
		flex: 1,
		marginRight: SPACING.sm,
	},
	title: {
		fontSize: FONTS.sizes.lg,
		fontWeight: FONTS.weights.semibold,
		marginBottom: SPACING.xs,
	},
	summary: {
		fontSize: FONTS.sizes.sm,
		lineHeight: 20,
		marginBottom: SPACING.sm,
	},
	speakerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: SPACING.xs,
	},
	speaker: {
		fontSize: FONTS.sizes.xs,
		fontWeight: FONTS.weights.medium,
	},
	chevron: {
		marginLeft: SPACING.sm,
	},
});
