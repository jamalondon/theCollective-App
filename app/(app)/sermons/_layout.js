import { Stack } from 'expo-router';

export default function SermonsLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerTransparent: true,
			}}
		>
			{/* Provide a friendly title instead of route name "index" */}
			<Stack.Screen name="index" options={{ headerShown: false }} />
		</Stack>
	);
}
