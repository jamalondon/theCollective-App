import { ActivityIndicator, Pressable, Text } from 'react-native';
import { useTheme, useThemedStyles } from '../hooks/useThemedStyles';
import { pressableOpacityStyle } from '../utils/pressableOpacityStyle';
import Icon from './Icon';

const LikeButton = ({
	handleToggleLike,
	likeSubmitting = false,
	likedByUser = false,
	likeCount = 0,
}) => {
	const { AppStyles } = useThemedStyles();
	const { colors } = useTheme();
	const styles = AppStyles.likeButtonStyles;

	return (
		<Pressable
			onPress={handleToggleLike}
			disabled={likeSubmitting}
			style={pressableOpacityStyle({
				style: [styles.button, { backgroundColor: colors.surface }],
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
					styles.text,
					{
						color: likedByUser ? 'red' : colors.text.secondary,
					},
				]}
			>
				{likeCount}
			</Text>
		</Pressable>
	);
};

export default LikeButton;
