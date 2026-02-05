import { Stack } from 'expo-router';

export default function SeriesDetailLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerTransparent: true,
				headerBackTitleVisible: false,
			}}
		>
			<Stack.Screen name="index" options={{ title: 'Series' }} />
			<Stack.Screen name="[sermonId]" />
		</Stack>
	);
}
