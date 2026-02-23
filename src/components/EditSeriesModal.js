import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { FONTS, SPACING } from '../constants/theme';
import { useTheme } from '../hooks/useThemedStyles';
import { fetchSeries, updateSeries } from '../store/sermonThunk';
import { pressableOpacityStyle } from '../utils/pressableOpacityStyle';

export default function EditSeriesModal({ visible, onClose, series }) {
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const insets = useSafeAreaInsets();
	const { seriesUpdating, seriesUpdateError } = useSelector(
		(s) => s.sermons || {},
	);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [coverImageUri, setCoverImageUri] = useState(null);
	const [existingCoverImage, setExistingCoverImage] = useState(null);
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

	// Populate form when modal opens
	useEffect(() => {
		if (visible && series) {
			setTitle(series.title || '');
			setDescription(series.description || '');
			setStartDate(
				series.start_date ? new Date(series.start_date) : new Date(),
			);
			setEndDate(
				series.end_date ? new Date(series.end_date) : new Date(),
			);
			setCoverImageUri(null);
			setExistingCoverImage(series.cover_image || null);
		}
	}, [visible, series]);

	const handlePickImage = async () => {
		const { status } =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert('We need camera roll permissions to change the cover image.');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.8,
		});

		if (!result.canceled && result.assets[0]) {
			setCoverImageUri(result.assets[0].uri);
		}
	};

	const handleSave = async () => {
		if (!title.trim()) {
			alert('Title is required.');
			return;
		}

		const updateData = {
			title: title.trim(),
			description: description.trim(),
			start_date: startDate.toISOString(),
			end_date: endDate.toISOString(),
		};

		await dispatch(
			updateSeries({
				seriesId: series.id,
				updateData,
				coverImageUri,
			}),
		).unwrap();

		dispatch(fetchSeries());
		onClose();
	};

	const previewImage = coverImageUri || existingCoverImage;

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<Pressable
				onPress={onClose}
				style={pressableOpacityStyle({
					style: styles.overlay,
					activeOpacity: 1,
				})}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={styles.keyboardView}
				>
					<Pressable
						onPress={(e) => e.stopPropagation()}
						style={pressableOpacityStyle({
							style: [
								styles.modalContent,
								{
									backgroundColor: colors.background,
									paddingBottom: insets.bottom + SPACING.lg,
								},
							],
							activeOpacity: 1,
						})}
					>
						{/* Header */}
						<View
							style={[
								styles.header,
								{ borderBottomColor: colors.border.default },
							]}
						>
							<View style={styles.handle} />
							<View style={styles.headerRow}>
								<Pressable
									onPress={onClose}
									style={pressableOpacityStyle({
										style: styles.headerButton,
									})}
								>
									<Text
										style={[
											styles.headerButtonText,
											{ color: colors.text.secondary },
										]}
									>
										Cancel
									</Text>
								</Pressable>
								<Text
									style={[
										styles.headerTitle,
										{ color: colors.text.primary },
									]}
								>
									Edit Series
								</Text>
								<Pressable
									onPress={handleSave}
									disabled={seriesUpdating}
									style={pressableOpacityStyle({
										style: styles.headerButton,
										disabled: seriesUpdating,
									})}
								>
									{seriesUpdating ? (
										<ActivityIndicator
											size="small"
											color={colors.primary}
										/>
									) : (
										<Text
											style={[
												styles.headerButtonText,
												{
													color: colors.primary,
													fontWeight: FONTS.weights.semibold,
												},
											]}
										>
											Save
										</Text>
									)}
								</Pressable>
							</View>
						</View>

						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.scrollContent}
						>
							{/* Cover Image */}
							<Text
								style={[
									styles.label,
									{ color: colors.text.primary },
								]}
							>
								Cover Image
							</Text>
							<Pressable
								onPress={handlePickImage}
								style={pressableOpacityStyle({
									style: [
										styles.imagePickerContainer,
										{
											backgroundColor: colors.surface,
											borderColor: colors.border.input,
										},
									],
								})}
							>
								{previewImage ? (
									<Image
										source={{ uri: previewImage }}
										style={styles.imagePreview}
										resizeMode="cover"
									/>
								) : (
									<View style={styles.imagePlaceholder}>
										<Ionicons
											name="image-outline"
											size={40}
											color={colors.text.secondary}
										/>
										<Text
											style={[
												styles.imagePlaceholderText,
												{ color: colors.text.secondary },
											]}
										>
											Tap to select an image
										</Text>
									</View>
								)}
								<View style={styles.imageOverlay}>
									<Ionicons
										name="camera-outline"
										size={20}
										color="#fff"
									/>
								</View>
							</Pressable>

							{/* Title */}
							<Text
								style={[
									styles.label,
									{ color: colors.text.primary },
								]}
							>
								Title
							</Text>
							<TextInput
								value={title}
								onChangeText={setTitle}
								placeholder="Series title"
								placeholderTextColor={colors.text.secondary}
								style={[
									styles.input,
									{
										backgroundColor: colors.surface,
										color: colors.text.primary,
										borderColor: colors.border.input,
									},
								]}
							/>

							{/* Description */}
							<Text
								style={[
									styles.label,
									{ color: colors.text.primary },
								]}
							>
								Description
							</Text>
							<TextInput
								value={description}
								onChangeText={setDescription}
								placeholder="Series description"
								placeholderTextColor={colors.text.secondary}
								multiline
								numberOfLines={4}
								style={[
									styles.input,
									styles.textArea,
									{
										backgroundColor: colors.surface,
										color: colors.text.primary,
										borderColor: colors.border.input,
									},
								]}
							/>

							{/* Start Date */}
							<Text
								style={[
									styles.label,
									{ color: colors.text.primary },
								]}
							>
								Start Date
							</Text>
							<Pressable
								onPress={() => setShowStartPicker(true)}
								style={pressableOpacityStyle({
									style: [
										styles.dateButton,
										{
											backgroundColor: colors.surface,
											borderColor: colors.border.input,
										},
									],
								})}
							>
								<Ionicons
									name="calendar-outline"
									size={20}
									color={colors.text.secondary}
								/>
								<Text
									style={[
										styles.dateText,
										{ color: colors.text.primary },
									]}
								>
									{startDate.toLocaleDateString()}
								</Text>
							</Pressable>
							{showStartPicker && (
								<DateTimePicker
									value={startDate}
									mode="date"
									display={
										Platform.OS === 'ios'
											? 'spinner'
											: 'default'
									}
									onChange={(event, date) => {
										setShowStartPicker(
											Platform.OS === 'ios',
										);
										if (date) setStartDate(date);
									}}
								/>
							)}

							{/* End Date */}
							<Text
								style={[
									styles.label,
									{ color: colors.text.primary },
								]}
							>
								End Date
							</Text>
							<Pressable
								onPress={() => setShowEndPicker(true)}
								style={pressableOpacityStyle({
									style: [
										styles.dateButton,
										{
											backgroundColor: colors.surface,
											borderColor: colors.border.input,
										},
									],
								})}
							>
								<Ionicons
									name="calendar-outline"
									size={20}
									color={colors.text.secondary}
								/>
								<Text
									style={[
										styles.dateText,
										{ color: colors.text.primary },
									]}
								>
									{endDate.toLocaleDateString()}
								</Text>
							</Pressable>
							{showEndPicker && (
								<DateTimePicker
									value={endDate}
									mode="date"
									display={
										Platform.OS === 'ios'
											? 'spinner'
											: 'default'
									}
									onChange={(event, date) => {
										setShowEndPicker(
											Platform.OS === 'ios',
										);
										if (date) setEndDate(date);
									}}
								/>
							)}

							{/* Error */}
							{seriesUpdateError ? (
								<Text style={[styles.errorText, { color: colors.error }]}>
									{typeof seriesUpdateError === 'string'
										? seriesUpdateError
										: 'Failed to update series'}
								</Text>
							) : null}
						</ScrollView>
					</Pressable>
				</KeyboardAvoidingView>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.55)',
		justifyContent: 'flex-end',
	},
	keyboardView: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	modalContent: {
		maxHeight: '90%',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
	header: {
		alignItems: 'center',
		paddingTop: SPACING.sm,
		paddingBottom: SPACING.md,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	handle: {
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#ccc',
		marginBottom: SPACING.md,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: SPACING.lg,
	},
	headerButton: {
		minWidth: 60,
	},
	headerButtonText: {
		fontSize: FONTS.sizes.md,
	},
	headerTitle: {
		fontSize: FONTS.sizes.lg,
		fontWeight: FONTS.weights.bold,
	},
	scrollContent: {
		padding: SPACING.lg,
		paddingBottom: SPACING.xxxl,
	},
	label: {
		fontSize: FONTS.sizes.sm,
		fontWeight: FONTS.weights.semibold,
		marginBottom: SPACING.sm,
		marginTop: SPACING.lg,
	},
	input: {
		borderWidth: 1,
		borderRadius: SPACING.md,
		padding: SPACING.lg,
		fontSize: FONTS.sizes.md,
	},
	textArea: {
		minHeight: 100,
		textAlignVertical: 'top',
	},
	dateButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: SPACING.sm,
		borderWidth: 1,
		borderRadius: SPACING.md,
		padding: SPACING.lg,
	},
	dateText: {
		fontSize: FONTS.sizes.md,
	},
	imagePickerContainer: {
		borderWidth: 1,
		borderRadius: SPACING.md,
		overflow: 'hidden',
		height: 180,
	},
	imagePreview: {
		width: '100%',
		height: '100%',
	},
	imagePlaceholder: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: SPACING.sm,
	},
	imagePlaceholderText: {
		fontSize: FONTS.sizes.sm,
	},
	imageOverlay: {
		position: 'absolute',
		bottom: SPACING.sm,
		right: SPACING.sm,
		backgroundColor: 'rgba(0,0,0,0.5)',
		borderRadius: 16,
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: {
		fontSize: FONTS.sizes.sm,
		marginTop: SPACING.lg,
		textAlign: 'center',
	},
});
