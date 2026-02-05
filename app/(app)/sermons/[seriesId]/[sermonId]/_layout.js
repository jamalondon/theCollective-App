import { Stack } from 'expo-router';

export default function SermonDetailLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerTransparent: true,
				headerBackTitleVisible: false,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: 'Sermon',
				}}
			/>
		</Stack>
	);
}
