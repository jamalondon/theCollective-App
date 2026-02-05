import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../src/store/themeSlice';

// Tab bar configuration constants
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 68 : 64;
const ICON_SIZE = 24;
const ICON_CONTAINER_SIZE = 34;

export default function AppLayout() {
	const { colors, isDarkMode } = useSelector(selectTheme);
	const insets = useSafeAreaInsets();
	const tabBarBottom = Math.max(18, insets.bottom + 14);

	return (
		<NativeTabs
			screenOptions={{
				headerShown: false,
			}}
		>
			<NativeTabs.Trigger name="index">
				<Label>Home</Label>
				<Icon sf={{ default: 'house', selected: 'house.fill' }} size={24} />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="profile">
				<Label>Profile</Label>
				<Icon sf={{ default: 'person', selected: 'person.fill' }} size={24} />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="sermons">
				<Label>Sermons</Label>
				<Icon sf={{ default: 'book', selected: 'book.fill' }} size={24} />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="meet-the-team">
				<Label>Meet the Team</Label>
				<Icon
					sf={{ default: 'person.3', selected: 'person.3.fill' }}
					drawable="group"
					size={24}
				/>
			</NativeTabs.Trigger>
		</NativeTabs>
	);
}
