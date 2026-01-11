import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';

import { useEffect, useState } from 'react';
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../src/components/Icon';
import { useTheme, useThemedStyles } from '../../src/hooks/useThemedStyles';
import { clearError } from '../../src/store/userSlice';
import { signUpUser } from '../../src/store/userThunk';
import { pressableOpacityStyle } from '../../src/utils/pressableOpacityStyle';

export default function SignUpScreen() {
	const dispatch = useDispatch();
	const { errorMessage, isVerificationRequired, token } = useSelector(
		(state) => state.user
	);
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState(new Date());
	const [phoneNumber, setPhoneNumber] = useState('');
	const [showDatePicker, setShowDatePicker] = useState(false);
	const { AuthStyles } = useThemedStyles();
	const { colors, isDarkMode } = useTheme();

	// Handle navigation based on sign-up response (mirrors sign-in flow)
	useEffect(() => {
		if (isVerificationRequired) {
			router.push('/sms-verification');
		} else if (token) {
			router.replace('/(app)');
		}
	}, [isVerificationRequired, token]);

	const handleSignUp = async () => {
		// Validate form
		if (
			!name ||
			!username ||
			!password ||
			!confirmPassword ||
			!dateOfBirth ||
			!phoneNumber
		) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}
		if (password !== confirmPassword) {
			Alert.alert('Error', 'Passwords do not match');
			return;
		}

		//make sure phone number is formatted correctly before sending to the server
		const formattedPhoneNumber = '+1' + phoneNumber;

		await dispatch(
			signUpUser({
				name,
				username,
				password,
				dateOfBirth,
				phoneNumber: formattedPhoneNumber,
			})
		);
	};

	// Clear errors when leaving this screen
	useEffect(() => {
		return () => {
			dispatch(clearError());
		};
	}, [dispatch]);

	const formatDate = (date) => {
		try {
			return date?.toLocaleDateString?.() ?? '';
		} catch {
			return '';
		}
	};

	return (
		<TouchableWithoutFeedback onPress={() => router.back()}>
			<View style={AuthStyles.modalStyles.overlay}>
				<TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
						style={AuthStyles.modalStyles.container}
					>
						<View style={AuthStyles.modalStyles.content}>
							<ScrollView
								contentContainerStyle={AuthStyles.modalStyles.scrollContent}
								keyboardShouldPersistTaps="handled"
								bounces={false}
							>
								<View style={AuthStyles.modalStyles.header}>
									<View style={AuthStyles.modalStyles.handle} />
									<Text style={AuthStyles.modalStyles.title}>Sign Up</Text>
								</View>

								<View style={AuthStyles.modalStyles.form}>
									<TextInput
										style={AuthStyles.modalStyles.input}
										placeholder="Full Name"
										placeholderTextColor="#888"
										value={name}
										onChangeText={setName}
										autoCapitalize="words"
										autoCorrect={false}
									/>

									<TextInput
										style={AuthStyles.modalStyles.input}
										placeholder="Username"
										placeholderTextColor="#888"
										value={username}
										onChangeText={setUsername}
										keyboardType="default"
										autoCapitalize="none"
										autoCorrect={false}
									/>
									<TextInput
										style={AuthStyles.modalStyles.input}
										placeholder="Phone Number"
										placeholderTextColor="#888"
										value={phoneNumber}
										onChangeText={setPhoneNumber}
										keyboardType="phone-pad"
										autoCapitalize="none"
									/>
									<TextInput
										style={AuthStyles.modalStyles.input}
										placeholder="Password"
										placeholderTextColor="#888"
										value={password}
										onChangeText={setPassword}
										secureTextEntry
										autoCapitalize="none"
									/>

									<TextInput
										style={AuthStyles.modalStyles.input}
										placeholder="Confirm Password"
										placeholderTextColor="#888"
										value={confirmPassword}
										onChangeText={setConfirmPassword}
										secureTextEntry
										autoCapitalize="none"
									/>

									<Pressable
										onPress={() => {
											setShowDatePicker(true);
											Keyboard.dismiss();
										}}
										style={pressableOpacityStyle({
											style: AuthStyles.modalStyles.dateButton,
										})}
									>
										<Text style={AuthStyles.modalStyles.dateButtonText}>
											Date of Birth: {formatDate(dateOfBirth)}
										</Text>
										<Icon.IoniconsIcon
											name="calendar"
											size={20}
											color={colors.text.secondary}
										/>
									</Pressable>

									{showDatePicker && (
										<View style={{ alignItems: 'center', width: '100%' }}>
											<DateTimePicker
												value={dateOfBirth}
												mode="date"
												display={Platform.OS === 'ios' ? 'spinner' : 'default'}
												onChange={(event, selectedDate) => {
													if (event?.type === 'dismissed') {
														setShowDatePicker(false);
														return;
													}
													if (selectedDate) setDateOfBirth(selectedDate);
													if (Platform.OS !== 'ios') setShowDatePicker(false);
												}}
												minimumDate={new Date('1900-01-01')}
												maximumDate={new Date()}
												themeVariant={
													Platform.OS === 'ios'
														? isDarkMode
															? 'dark'
															: 'light'
														: undefined
												}
												textColor={
													Platform.OS === 'ios'
														? colors.text.primary
														: undefined
												}
												style={
													Platform.OS === 'ios'
														? { width: '100%' }
														: AuthStyles.modalStyles.datePicker
												}
											/>
										</View>
									)}

									{Platform.OS === 'ios' && showDatePicker && (
										<Pressable
											onPress={() => setShowDatePicker(false)}
											style={pressableOpacityStyle({
												style: [
													AuthStyles.modalStyles.button,
													{ marginTop: 8 },
												],
											})}
										>
											<Text style={AuthStyles.modalStyles.buttonText}>
												Done
											</Text>
										</Pressable>
									)}
									<Pressable
										onPress={() => {
											handleSignUp();
											Keyboard.dismiss();
										}}
										style={pressableOpacityStyle({
											style: AuthStyles.modalStyles.button,
										})}
									>
										<Text style={AuthStyles.modalStyles.buttonText}>
											Sign Up
										</Text>
									</Pressable>

									<Pressable
										onPress={() => router.back()}
										style={pressableOpacityStyle({ style: null })}
									>
										<Text style={AuthStyles.modalStyles.cancelText}>
											Cancel
										</Text>
									</Pressable>

									{errorMessage && (
										<Text style={AuthStyles.modalStyles.errorText}>
											{errorMessage}
										</Text>
									)}
								</View>
							</ScrollView>
						</View>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
			</View>
		</TouchableWithoutFeedback>
	);
}
