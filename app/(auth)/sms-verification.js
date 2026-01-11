import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
	Animated,
	KeyboardAvoidingView,
	Pressable,
	Platform,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useThemedStyles } from '../../src/hooks/useThemedStyles';
import { selectTheme } from '../../src/store/themeSlice';
import { pressableOpacityStyle } from '../../src/utils/pressableOpacityStyle';
import { sendVerificationSms, verifySmsCode } from '../../src/store/userThunk';

export default function SmsVerificationScreen() {
	const { colors } = useSelector(selectTheme);
	const { AuthStyles } = useThemedStyles();
	const dispatch = useDispatch();
	const router = useRouter();
	const { errorMessage, phoneNumber } = useSelector((state) => state.user);

	const [code, setCode] = useState('');
	const [resendCooldown, setResendCooldown] = useState(0);
	const shakeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (errorMessage) {
			Animated.sequence([
				Animated.timing(shakeAnim, {
					toValue: 10,
					duration: 60,
					useNativeDriver: true,
				}),
				Animated.timing(shakeAnim, {
					toValue: -10,
					duration: 60,
					useNativeDriver: true,
				}),
				Animated.timing(shakeAnim, {
					toValue: 8,
					duration: 60,
					useNativeDriver: true,
				}),
				Animated.timing(shakeAnim, {
					toValue: -8,
					duration: 60,
					useNativeDriver: true,
				}),
				Animated.timing(shakeAnim, {
					toValue: 0,
					duration: 60,
					useNativeDriver: true,
				}),
			]).start();
		}
	}, [errorMessage, shakeAnim]);

	// Send verification SMS on initial load
	useEffect(() => {
		if (phoneNumber) {
			dispatch(sendVerificationSms({ phoneNumber }));
		}
	}, [dispatch, phoneNumber]);

	// Cooldown timer for resend button
	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(() => {
				setResendCooldown(resendCooldown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	const handleVerify = () => {
		if (!phoneNumber || code.length < 4) return;
		dispatch(verifySmsCode({ phoneNumber, code }));
	};

	const handleResend = () => {
		if (resendCooldown > 0 || !phoneNumber) return;

		dispatch(sendVerificationSms({ phoneNumber }));
		setResendCooldown(60); // 60 second cooldown
	};

	return (
		<View style={AuthStyles.SmsVerificationStyles.modalOverlay}>
			<TouchableWithoutFeedback>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={AuthStyles.SmsVerificationStyles.modalContent}
				>
					{/* Header */}
					<View style={AuthStyles.SmsVerificationStyles.header}>
						<Pressable
							onPress={() => router.back()}
							style={pressableOpacityStyle({
								style: AuthStyles.SmsVerificationStyles.closeButton,
							})}
						>
							<Text style={AuthStyles.SmsVerificationStyles.closeButtonText}>
								✕
							</Text>
						</Pressable>
						<Text style={AuthStyles.SmsVerificationStyles.title}>
							Verify your phone
						</Text>
					</View>
					{/* Subtitle */}
					<Text style={AuthStyles.SmsVerificationStyles.subtitle}>
						We sent a 6-digit code to
					</Text>
					{/* Phone number */}
					<Text style={AuthStyles.SmsVerificationStyles.emailText}>
						{phoneNumber}
					</Text>

					{/* Error message */}
					{!!errorMessage && (
						<Text style={AuthStyles.SmsVerificationStyles.errorText}>
							{errorMessage}
						</Text>
					)}

					{/* Code input */}
					<Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
						<TextInput
							style={AuthStyles.SmsVerificationStyles.input}
							placeholder="Enter code"
							placeholderTextColor={colors.text.secondary}
							keyboardType="number-pad"
							value={code}
							onChangeText={setCode}
							maxLength={6}
						/>
					</Animated.View>

					{/* Verify button */}
					<Pressable
						onPress={handleVerify}
						disabled={!code || code.length < 4}
						style={pressableOpacityStyle({
							style: [
								AuthStyles.SmsVerificationStyles.verifyButton,
								(!code || code.length < 4) &&
									AuthStyles.SmsVerificationStyles.verifyButtonDisabled,
							],
							disabled: !code || code.length < 4,
						})}
					>
						<Text style={AuthStyles.SmsVerificationStyles.verifyButtonText}>
							Verify
						</Text>
					</Pressable>

					{/* Resend button */}
					<Pressable
						onPress={handleResend}
						disabled={resendCooldown > 0}
						style={pressableOpacityStyle({
							style: AuthStyles.SmsVerificationStyles.resendButton,
							disabled: resendCooldown > 0,
						})}
					>
						<Text style={AuthStyles.SmsVerificationStyles.resendButtonText}>
							{resendCooldown > 0
								? `Resend code (${resendCooldown}s)`
								: 'Resend code'}
						</Text>
					</Pressable>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</View>
	);
}
