import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '../../src/hooks/useThemedStyles';
import { pressableOpacityStyle } from '../../src/utils/pressableOpacityStyle';

export default function WelcomeScreen() {
	const { AuthStyles } = useThemedStyles();
	return (
		<SafeAreaView style={AuthStyles.welcomeStyles.container}>
			{/* Logo with proper notch spacing */}
			<View style={AuthStyles.welcomeStyles.logoContainer}>
				<Image
					source={require('../../assets/images/logo-transparent.png')}
					style={AuthStyles.welcomeStyles.logo}
					contentFit="contain"
				/>
			</View>

			{/* Welcome text */}
			<View style={AuthStyles.welcomeStyles.textContainer}>
				<Text style={AuthStyles.welcomeStyles.title}>
					Lets get more connected.
				</Text>
				<Text style={AuthStyles.welcomeStyles.titleEmphasized}>Together.</Text>
			</View>

			{/* Social sign-in buttons */}
			<View style={AuthStyles.welcomeStyles.buttonContainer}>
				{/* Google sign in */}
				<Pressable
					onPress={() => {
						/* Handle Google sign in */
					}}
					style={pressableOpacityStyle({
						style: AuthStyles.welcomeStyles.socialButton,
					})}
				>
					<Image
						source={require('../../assets/images/64px_chrome_icon.png')}
						style={AuthStyles.welcomeStyles.buttonIcon}
					/>
					<Text style={AuthStyles.welcomeStyles.socialButtonText}>
						Continue with Google (Coming Soon)
					</Text>
				</Pressable>

				{/* Apple sign in */}
				<Pressable
					onPress={() => {
						/* Handle Apple sign in */
					}}
					style={pressableOpacityStyle({
						style: AuthStyles.welcomeStyles.socialButton,
					})}
				>
					<Image
						source={require('../../assets/images/64px_apple.png')}
						style={AuthStyles.welcomeStyles.buttonIcon}
					/>
					<Text style={AuthStyles.welcomeStyles.socialButtonText}>
						Continue with Apple (Coming Soon)
					</Text>
				</Pressable>
			</View>

			{/* Create account button */}
			<Pressable
				onPress={() => router.push('/(auth)/sign-up')}
				style={pressableOpacityStyle({
					style: AuthStyles.welcomeStyles.createAccountButton,
				})}
			>
				<Text style={AuthStyles.welcomeStyles.createAccountText}>
					Create account
				</Text>
			</Pressable>

			{/* Terms and conditions */}
			<View style={AuthStyles.welcomeStyles.termsContainer}>
				<Text style={AuthStyles.welcomeStyles.termsText}>
					By signing up, you agree to our
					<Text style={AuthStyles.welcomeStyles.link}> Terms</Text>,
					<Text style={AuthStyles.welcomeStyles.link}> Privacy Policy</Text>,
					and
					<Text style={AuthStyles.welcomeStyles.link}> Cookie Use</Text>.
				</Text>
			</View>

			{/* Sign in link */}
			<View style={AuthStyles.welcomeStyles.signInContainer}>
				<Text style={AuthStyles.welcomeStyles.signInText}>
					Already have an account?
				</Text>
				<Pressable
					onPress={() => router.push('/(auth)/sign-in')}
					style={pressableOpacityStyle({ style: null })}
				>
					<Text style={AuthStyles.welcomeStyles.signInLink}>Sign in</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
