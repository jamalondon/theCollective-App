import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useThemedStyles } from '../../src/hooks/useThemedStyles';
import { signInUser } from '../../src/store/userThunk';
import { pressableOpacityStyle } from '../../src/utils/pressableOpacityStyle';

export default function SignInScreen() {
	const dispatch = useDispatch();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { AuthStyles } = useThemedStyles();
	const { errorMessage, isVerificationRequired, token } = useSelector(
		(state) => state.user
	);

	// Handle navigation based on sign-in response
	useEffect(() => {
		if (isVerificationRequired) {
			// Navigate to SMS verification screen when verification is required
			router.push('/sms-verification');
		} else if (token) {
			// User is successfully signed in, navigate to main app
			router.replace('/(app)');
		}
	}, [isVerificationRequired, token]);

	const handleSignIn = async () => {
		// Dispatch the sign-in action - response handled by useEffect
		await dispatch(signInUser({ username, password }));
	};

	return (
		<TouchableWithoutFeedback onPress={() => router.back()}>
			<SafeAreaView style={AuthStyles.modalStyles.overlay}>
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
									<Text style={AuthStyles.modalStyles.title}>Sign In</Text>
								</View>

								<View style={AuthStyles.modalStyles.form}>
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
										placeholder="Password"
										placeholderTextColor="#888"
										value={password}
										onChangeText={setPassword}
										secureTextEntry
										autoCapitalize="none"
									/>

									{errorMessage && (
										<Text
											style={[
												AuthStyles.modalStyles.errorText,
												{ color: '#ff4444', marginVertical: 10 },
											]}
										>
											{errorMessage}
										</Text>
									)}

									<Pressable
										onPress={handleSignIn}
										style={pressableOpacityStyle({
											style: AuthStyles.modalStyles.button,
										})}
									>
										<Text style={AuthStyles.modalStyles.buttonText}>
											Sign In
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
								</View>
							</ScrollView>
						</View>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
}
