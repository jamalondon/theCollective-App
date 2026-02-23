import { Stack } from 'expo-router';

export default function SermonsLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			{/* Provide a friendly title instead of route name "index" */}
			<Stack.Screen name="index" />
		</Stack>
	);
}
