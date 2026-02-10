import { LinearGradient } from 'expo-linear-gradient';
import {
	Dimensions,
	ImageBackground,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { FONTS, SPACING } from '../constants/theme';
import { useTheme } from '../hooks/useThemedStyles';
import { pressableOpacityStyle } from '../utils/pressableOpacityStyle';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - SPACING.xxxl * 2;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.5;

export default function SermonSeriesCard({ series, onPress }) {
	const { colors } = useTheme();

	// Validate series properties before rendering
	const validatedSeries = {
		title: typeof series.title === 'string' ? series.title : 'Untitled Series',
		start_date: series.start_date
			? new Date(series.start_date).toLocaleDateString()
			: null,
		end_date: series.end_date
			? new Date(series.end_date).toLocaleDateString()
			: null,
		sermon_count: series.sermons.length >= 0 ? series.sermons.length : 0,
		cover_image: series.cover_image || null,
	};

	const imageSource = validatedSeries.cover_image
		? { uri: validatedSeries.cover_image }
		: require('../../assets/images/default_sermon.jpg');

	return (
		<Pressable
			onPress={onPress}
			style={pressableOpacityStyle({
				style: styles.container,
				activeOpacity: 0.95,
			})}
		>
			<ImageBackground
				source={imageSource}
				style={styles.coverImage}
				resizeMode="cover"
			>
				<LinearGradient
					colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
					style={styles.gradient}
				>
					<View style={styles.contentContainer}>
						<Text style={styles.title} numberOfLines={3}>
							{validatedSeries.title}
						</Text>
						{validatedSeries.start_date && validatedSeries.end_date ? (
							<Text style={styles.dates}>
								{validatedSeries.start_date} - {validatedSeries.end_date}
							</Text>
						) : null}
						{validatedSeries.sermon_count > 0 ? (
							<Text style={styles.count}>
								{validatedSeries.sermon_count}{' '}
								{validatedSeries.sermon_count === 1 ? 'sermon' : 'sermons'}
							</Text>
						) : null}
					</View>
				</LinearGradient>
			</ImageBackground>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		width: CARD_WIDTH,
		height: CARD_HEIGHT,
		marginBottom: SPACING.xl,
		marginHorizontal: SPACING.xxxl,
		borderRadius: 24,
		overflow: 'hidden',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 8 },
				shadowOpacity: 0.3,
				shadowRadius: 16,
			},
			android: {
				elevation: 12,
			},
		}),
	},
	coverImage: {
		width: '100%',
		height: '100%',
		backgroundColor: '#333',
	},
	gradient: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	contentContainer: {
		padding: SPACING.xxxl,
		paddingBottom: SPACING.xxxl,
	},
	title: {
		fontSize: FONTS.sizes.xxl + 4,
		fontWeight: FONTS.weights.bold,
		color: '#FFFFFF',
		marginBottom: SPACING.md,
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 4,
	},
	dates: {
		fontSize: FONTS.sizes.md,
		color: '#FFFFFF',
		opacity: 0.9,
		marginBottom: SPACING.xs,
	},
	count: {
		fontSize: FONTS.sizes.lg,
		fontWeight: FONTS.weights.semibold,
		color: '#FFFFFF',
		opacity: 0.95,
		marginTop: SPACING.sm,
	},
});
