import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Icon from '../../src/components/Icon.js';
import { selectTheme } from '../../src/store/themeSlice';

const { EntypoIcon, FontAwesome6 } = Icon;

// Tab bar configuration constants
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 68 : 64;
const ICON_SIZE = 24;
const ICON_CONTAINER_SIZE = 34;

export default function AppLayout() {
	const { colors, isDarkMode } = useSelector(selectTheme);
	const insets = useSafeAreaInsets();
	const tabBarBottom = Math.max(18, insets.bottom + 14);

	return (
		<View style={{ flex: 1 }}>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarHideOnKeyboard: true,
					tabBarActiveTintColor: 'red',
					tabBarInactiveTintColor: '#999999',
					tabBarStyle: {
						position: 'absolute',
						// Use symmetric constraints so it is *truly* centered on all platforms
						left: 0,
						right: 0,
						marginHorizontal: 48,
						bottom: tabBarBottom,
						height: TAB_BAR_HEIGHT,
						paddingTop: 6,
						paddingBottom: 6,
						borderTopWidth: 0,
						borderTopColor: 'transparent',
						borderWidth: 1,
						borderColor:
							colors.border?.default ?? (isDarkMode ? '#2D2D2D' : '#E5E5E5'),
						backgroundColor: colors.card ?? colors.surface,
						borderRadius: 999,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 10 },
						shadowOpacity: isDarkMode ? 0.45 : 0.12,
						shadowRadius: 18,
						elevation: 18,
					},
					tabBarLabelStyle: {
						fontSize: 11,
						fontWeight: '600',
						marginTop: 2,
					},
					tabBarIconStyle: {
						marginTop: 0,
						marginBottom: 0,
					},
					tabBarItemStyle: {
						paddingVertical: 4,
					},
				}}
			>
				<Tabs.Screen
					name="meet-the-team"
					options={{
						title: 'Connect',
						tabBarIcon: ({ color, focused }) => (
							<View
								style={{
									height: ICON_CONTAINER_SIZE,
									width: ICON_CONTAINER_SIZE,
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<FontAwesome6
									name="people-group"
									color={color}
									size={ICON_SIZE}
								/>
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="index"
					options={{
						title: 'Home',
						tabBarIcon: ({ color, focused }) => (
							<View
								style={{
									height: ICON_CONTAINER_SIZE,
									width: ICON_CONTAINER_SIZE,
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<EntypoIcon name="home" color={color} size={ICON_SIZE} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: 'Profile',
						tabBarIcon: ({ color, focused }) => (
							<View
								style={{
									height: ICON_CONTAINER_SIZE,
									width: ICON_CONTAINER_SIZE,
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<EntypoIcon name="user" color={color} size={ICON_SIZE} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="sermons"
					options={{
						href: null,
						tabBarStyle: { display: 'none' },
					}}
				/>
			</Tabs>
		</View>
	);
}
