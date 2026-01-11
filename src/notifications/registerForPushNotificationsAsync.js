import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/*
  Registers the device for Expo push notifications and returns an Expo push token.
 
  Notes:
  - Remote push delivery requires a real device + proper APNs/FCM credentials.
  - On iOS TestFlight/App Store builds, APNs credentials must be configured in EAS/Apple Dev.
 */
export async function registerForPushNotificationsAsync() {
	// Android: notification channel is required for proper behavior (safe to call even if iOS-only today).
	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	// Check if the user has granted permissions to receive notifications
	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	// If the user has not granted permissions to receive notifications, request permissions
	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync({
			ios: {
				allowAlert: true,
				allowBadge: true,
				allowSound: true,
			},
		});
		finalStatus = status;
	}

	if (finalStatus !== 'granted') {
		return null;
	}

	// Get the project ID from the Expo config
	const projectId =
		Constants?.expoConfig?.extra?.eas?.projectId ??
		Constants?.easConfig?.projectId;

	// `projectId` is required in modern Expo SDKs; your app.json already includes it under extra.eas.projectId
	const tokenResponse = await Notifications.getExpoPushTokenAsync({
		projectId,
	});

	return tokenResponse?.data ?? null;
}
