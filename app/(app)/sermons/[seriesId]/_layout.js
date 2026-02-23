import { Stack } from 'expo-router';

export default function SeriesDetailLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerBackTitleVisible: true,
				headerBackTitle: 'Back',
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: '',
					headerTintColor: '#fff',
				}}
			/>
			<Stack.Screen name="[sermonId]" />
		</Stack>
	);
}
