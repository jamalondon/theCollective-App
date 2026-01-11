import ExpoCheckbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../src/components/Icon';
import { useTheme, useThemedStyles } from '../src/hooks/useThemedStyles';
import {
	clearError,
	setError,
	setIsLoading,
} from '../src/store/prayerRequestSlice';
import { createPrayerRequest } from '../src/store/prayerRequestThunk';
import { pressableOpacityStyle } from '../src/utils/pressableOpacityStyle';

export default function CreatePrayerRequest() {
	// State
	const [prayerText, setPrayerText] = useState('');
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [images, setImages] = useState([]);
	const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const textInputRef = useRef(null);
	const scrollViewRef = useRef(null);

	// Hooks
	const { colors } = useTheme();
	const { createPrayerRequestStyles } = useThemedStyles();
	const { isLoading, error } = useSelector((state) => state.prayerRequests);
	const { userID } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const insets = useSafeAreaInsets();

	// make sure the isLoading state is false when the component mounts
	useEffect(() => {
		if (error) {
			setErrorMessage(String(error));
			setIsErrorModalVisible(true);
		}
		if (isLoading) {
			dispatch(setIsLoading(false));
		}
	}, [dispatch, isLoading, error]);

	const closeErrorModal = () => {
		setIsErrorModalVisible(false);
		setErrorMessage('');
		dispatch(clearError());
	};

	const handleTextChange = (text) => {
		console.log('text', text);
		// Trim the text if the user creates a new line past double line
		if (text.endsWith('\n\n\n')) {
			setPrayerText(text.slice(0, text.length - 1));
		} else {
			setPrayerText(text);
		}
	};

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status !== 'granted') {
			Alert.alert(
				'Permission Required',
				'Sorry, we need camera roll permissions to upload images!'
			);
			return;
		}

		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.8,
			});

			if (!result.canceled && result.assets && result.assets[0]) {
				setImages([...images, result.assets[0].uri]);
			}
		} catch (error) {
			console.error('Error picking image:', error);
			Alert.alert(
				'Error',
				'There was an error selecting the image. Please try again.'
			);
		}
	};

	const removeImage = (index) => {
		const newImages = [...images];
		newImages.splice(index, 1);
		setImages(newImages);
	};

	const submitPrayerRequest = async () => {
		const formData = new FormData();

		if (!prayerText.trim()) {
			return;
		}

		//build the form data to send to the server
		formData.append('text', prayerText);
		formData.append('anonymous', isAnonymous);
		formData.append('user_id', userID);
		// turn the images into base64 before sending to the server
		// For each image picked add it to the form data
		images.forEach((imageUri, index) => {
			formData.append('images', {
				uri: imageUri,
				type: 'image/jpeg', // or the actual mimetype
				name: `photo_${index}.jpg`,
			});
		});

		try {
			await dispatch(
				createPrayerRequest({
					formData,
				})
			).unwrap();

			// Clear any previous errors
			dispatch(setError(null));

			// Close the modal and navigate back
			router.back();
		} catch (error) {
			console.error('Error submitting prayer request:', error);
			dispatch(
				setError(
					error?.message || 'Failed to submit prayer request. Please try again.'
				)
			);
		}
	};

	return (
		<View
			style={[
				createPrayerRequestStyles.container,
				{
					paddingTop: insets.top,
					paddingLeft: insets.left,
					paddingRight: insets.right,
				},
			]}
		>
			<Modal
				transparent
				animationType="fade"
				visible={isErrorModalVisible}
				onRequestClose={closeErrorModal}
			>
				<View style={createPrayerRequestStyles.errorModalOverlay}>
					<View style={createPrayerRequestStyles.errorModalCard}>
						<Text style={createPrayerRequestStyles.errorModalTitle}>
							Something went wrong
						</Text>
						<Text style={createPrayerRequestStyles.errorModalMessage}>
							{errorMessage ||
								'Failed to submit prayer request. Please try again.'}
						</Text>
						<Pressable
							onPress={closeErrorModal}
							style={pressableOpacityStyle({
								style: createPrayerRequestStyles.errorModalButton,
								activeOpacity: 0.9,
							})}
						>
							<Text style={createPrayerRequestStyles.errorModalButtonText}>
								OK
							</Text>
						</Pressable>
					</View>
				</View>
			</Modal>

			{/* Back Button */}
			<Pressable
				onPress={() => router.back()}
				style={pressableOpacityStyle({
					style: { paddingLeft: 16, paddingTop: 16, paddingBottom: 8 },
				})}
			>
				<Icon.IoniconsIcon name="arrow-back" size={36} color={colors.primary} />
			</Pressable>

			<ScrollView
				ref={scrollViewRef}
				style={createPrayerRequestStyles.scrollContainer}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
				showsVerticalScrollIndicator={false}
				onScrollBeginDrag={() => Keyboard.dismiss()}
			>
				<Pressable onPress={() => textInputRef.current?.focus()}>
					<TextInput
						ref={textInputRef}
						style={createPrayerRequestStyles.input}
						multiline
						placeholder="How can the Collective pray for you?"
						placeholderTextColor={colors.text.secondary}
						value={prayerText}
						onChangeText={handleTextChange}
						scrollEnabled={false}
						autoFocus={true}
						autoCorrect={true}
					/>

					<View style={createPrayerRequestStyles.footerRow}>
						<Pressable
							onPress={() => setIsAnonymous(!isAnonymous)}
							style={pressableOpacityStyle({
								style: createPrayerRequestStyles.anonymousContainer,
								activeOpacity: 0.7,
							})}
						>
							<ExpoCheckbox
								value={isAnonymous}
								onValueChange={setIsAnonymous}
								color={isAnonymous ? colors.primary : undefined}
								style={createPrayerRequestStyles.checkbox}
							/>
							<Text style={createPrayerRequestStyles.anonymousLabel}>
								Anonymous
							</Text>
						</Pressable>
					</View>
				</Pressable>
			</ScrollView>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
			>
				{images.length > 0 && (
					<FlatList
						data={images}
						horizontal
						keyExtractor={(item, index) => item + index}
						style={createPrayerRequestStyles.imageContainer}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item, index }) => (
							<View style={createPrayerRequestStyles.imageWrapper}>
								<Image
									source={{ uri: item }}
									style={createPrayerRequestStyles.image}
								/>
								<Pressable
									onPress={() => removeImage(index)}
									style={pressableOpacityStyle({
										style: createPrayerRequestStyles.removeImage,
									})}
								>
									<Icon.IoniconsIcon name="close" size={20} color="white" />
								</Pressable>
							</View>
						)}
					/>
				)}

				<View style={createPrayerRequestStyles.footer}>
					<Pressable
						onPress={pickImage}
						style={pressableOpacityStyle({
							style: createPrayerRequestStyles.imageButton,
						})}
					>
						<Icon.IoniconsIcon name="image" size={24} color={colors.primary} />
					</Pressable>

					{(() => {
						const isSubmitDisabled =
							(!prayerText.trim() && images.length === 0) || isLoading;
						return (
							<Pressable
								disabled={isSubmitDisabled}
								onPress={submitPrayerRequest}
								style={pressableOpacityStyle({
									style: [
										createPrayerRequestStyles.submitButton,
										isSubmitDisabled &&
											createPrayerRequestStyles.submitButtonDisabled,
										isLoading && createPrayerRequestStyles.submitButtonLoading,
									],
									disabled: isSubmitDisabled,
								})}
							>
								{isLoading ? (
									<ActivityIndicator color={colors.text.button} />
								) : (
									<Text style={createPrayerRequestStyles.submitButtonText}>
										Share Prayer Request
									</Text>
								)}
							</Pressable>
						);
					})()}
				</View>
			</KeyboardAvoidingView>
		</View>
	);
}
