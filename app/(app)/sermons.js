import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function SermonsScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Sermons</Text>
			<Link href="/" style={{ marginTop: 16, color: '#0a84ff' }}>Home</Link>
		</View>
	);
}
