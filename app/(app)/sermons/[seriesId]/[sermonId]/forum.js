import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Icon from '../../../../../src/components/Icon';
import { SPACING } from '../../../../../src/constants/theme';
import { useFormatAgeOfDate } from '../../../../../src/hooks/useFormatAgeOfDate';
import { useTheme } from '../../../../../src/hooks/useThemedStyles';
import { selectTheme } from '../../../../../src/store/themeSlice';
import { pressableOpacityStyle } from '../../../../../src/utils/pressableOpacityStyle';

const { FontAwesome6 } = Icon;

export default function SermonForum() {
	const { sermonId, discussionId } = useLocalSearchParams();
	const { colors } = useTheme();
	const { isDarkMode } = useSelector(selectTheme);
	const insets = useSafeAreaInsets();
	const formatAgeOfDate = useFormatAgeOfDate();

	const [comments, setComments] = useState([
		{
			id: '1',
			author: 'John Smith',
			avatar: null,
			content:
				'Great sermon! This really resonated with me. The way the speaker connected the scripture to modern life was insightful.',
			timestamp: new Date(Date.now() - 3600000),
			likes: 5,
			liked: false,
		},
		{
			id: '2',
			author: 'Sarah Johnson',
			avatar: null,
			content:
				'I appreciated the emphasis on faith. It challenged me to think deeper about my own spiritual journey.',
			timestamp: new Date(Date.now() - 7200000),
			likes: 3,
			liked: false,
		},
		{
			id: '3',
			author: 'Michael Chen',
			avatar: null,
			content:
				'Does anyone have book recommendations to dive deeper into this topic? Would love to study more.',
			timestamp: new Date(Date.now() - 86400000),
			likes: 2,
			liked: false,
		},
	]);

	const [newComment, setNewComment] = useState('');

	const handleAddComment = () => {
		if (newComment.trim()) {
			const comment = {
				id: String(Date.now()),
				author: 'You',
				avatar: null,
				content: newComment,
				timestamp: new Date(),
				likes: 0,
				liked: false,
			};
			setComments([comment, ...comments]);
			setNewComment('');
		}
	};

	const handleLikeComment = (commentId) => {
		setComments(
			comments.map((c) =>
				c.id === commentId
					? {
							...c,
							liked: !c.liked,
							likes: c.liked ? c.likes - 1 : c.likes + 1,
						}
					: c,
			),
		);
	};

	const CommentItem = ({ comment }) => (
		<View
			style={[
				styles.comment,
				{
					backgroundColor: colors.card ?? colors.surface,
					borderBottomColor:
						colors.border?.default ?? (isDarkMode ? '#2D2D2D' : '#E5E5E5'),
				},
			]}
		>
			<View style={styles.commentHeader}>
				<View style={styles.authorInfo}>
					<View
						style={[
							styles.avatar,
							{ backgroundColor: colors.primary ?? '#FF0000' },
						]}
					>
						<Text style={[styles.avatarText, { color: colors.card }]}>
							{comment.author.charAt(0).toUpperCase()}
						</Text>
					</View>
					<View>
						<Text style={[styles.author, { color: colors.text.primary }]}>
							{comment.author}
						</Text>
						<Text style={{ color: colors.text.tertiary, fontSize: 12 }}>
							{formatAgeOfDate(comment.timestamp)}
						</Text>
					</View>
				</View>
			</View>

			<Text style={[styles.commentText, { color: colors.text.primary }]}>
				{comment.content}
			</Text>

			<View style={styles.commentFooter}>
				<Pressable
					style={({ pressed }) => [
						styles.likeButton,
						{
							opacity: pressableOpacityStyle(pressed),
						},
					]}
					onPress={() => handleLikeComment(comment.id)}
				>
					<FontAwesome6
						name="heart"
						size={14}
						color={comment.liked ? '#FF0000' : colors.text.tertiary}
						solid={comment.liked}
					/>
					<Text
						style={[
							styles.likeText,
							{
								color: comment.liked ? '#FF0000' : colors.text.tertiary,
							},
						]}
					>
						{comment.likes}
					</Text>
				</Pressable>
			</View>
		</View>
	);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={[styles.container, { backgroundColor: colors.background }]}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
		>
			<FlatList
				data={comments}
				renderItem={({ item }) => <CommentItem comment={item} />}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					paddingBottom: SPACING.lg,
				}}
				ListEmptyComponent={() => (
					<View style={{ padding: SPACING.lg, alignItems: 'center' }}>
						<Text style={{ color: colors.text.secondary }}>
							No comments yet. Be the first to share your thoughts!
						</Text>
					</View>
				)}
			/>

			<View
				style={[
					styles.inputContainer,
					{
						backgroundColor: colors.card ?? colors.surface,
						borderTopColor:
							colors.border?.default ?? (isDarkMode ? '#2D2D2D' : '#E5E5E5'),
						paddingBottom: Math.max(insets.bottom, SPACING.md),
					},
				]}
			>
				<TextInput
					style={[
						styles.input,
						{
							color: colors.text.primary,
							backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
							borderColor:
								colors.border?.default ?? (isDarkMode ? '#2D2D2D' : '#E5E5E5'),
						},
					]}
					placeholder="Share your thoughts..."
					placeholderTextColor={colors.text.tertiary}
					value={newComment}
					onChangeText={setNewComment}
					multiline
					maxLength={500}
				/>
				<Pressable
					style={({ pressed }) => [
						styles.sendButton,
						{
							backgroundColor: colors.primary ?? '#FF0000',
							opacity: pressableOpacityStyle(pressed),
						},
					]}
					onPress={handleAddComment}
					disabled={!newComment.trim()}
				>
					<FontAwesome6 name="paper-plane" size={16} color="#fff" />
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	comment: {
		padding: SPACING.md,
		borderBottomWidth: 1,
	},
	commentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: SPACING.sm,
	},
	authorInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: SPACING.sm,
	},
	avatarText: { fontSize: 14, fontWeight: '600' },
	author: { fontSize: 14, fontWeight: '600' },
	commentText: { fontSize: 14, lineHeight: 20, marginVertical: SPACING.sm },
	commentFooter: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginTop: SPACING.sm,
	},
	likeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	likeText: { fontSize: 12, fontWeight: '500' },
	inputContainer: {
		borderTopWidth: 1,
		paddingHorizontal: SPACING.lg,
		paddingTop: SPACING.md,
		flexDirection: 'row',
		alignItems: 'flex-end',
		gap: SPACING.md,
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderRadius: 20,
		paddingHorizontal: SPACING.md,
		paddingVertical: SPACING.sm,
		maxHeight: 100,
		fontSize: 14,
	},
	sendButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 4,
	},
});
