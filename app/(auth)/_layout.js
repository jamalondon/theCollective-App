import { Stack } from 'expo-router';

export default function AuthLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="welcome" />
			<Stack.Screen
				name="sign-in"
				options={{
					presentation: 'transparentModal',
				}}
			/>
			<Stack.Screen
				name="sign-up"
				options={{
					presentation: 'transparentModal',
				}}
			/>
			<Stack.Screen
				name="sms-verification"
				options={{
					presentation: 'transparentModal',
				}}
			/>
		</Stack>
	);
}
