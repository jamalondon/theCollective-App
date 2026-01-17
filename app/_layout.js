import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import {
	SafeAreaProvider,
	initialWindowMetrics,
} from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';

import * as Sentry from '@sentry/react-native';
import { registerForPushNotificationsAsync } from '../src/notifications/registerForPushNotificationsAsync';
import store from '../src/store';
import { fetchNotificationPreferences } from '../src/store/notificationPreferencesThunk';
import { registerPushToken } from '../src/store/userThunk';

Sentry.init({
	dsn: 'https://63466acac998832b6dbb4f967089eef5@o4510427885010944.ingest.us.sentry.io/4510427885928448',

	// Adds more context data to events (IP address, cookies, user, etc.)
	// For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
	sendDefaultPii: true,

	// Enable Logs
	enableLogs: true,

	// Configure Session Replay
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1,
	integrations: [
		Sentry.mobileReplayIntegration(),
		Sentry.feedbackIntegration(),
	],

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: __DEV__,
});

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

function NotificationBootstrapper() {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.user.token);
	const { loading, error, preferences } = useSelector(
		(state) => state.notificationPreferences
	);
	const responseListener = useRef();
	const receivedListener = useRef();

	useEffect(() => {
		// Clear badge when user opens the app (simple baseline behavior)
		const sub = AppState.addEventListener('change', (state) => {
			if (state === 'active') {
				Notifications.setBadgeCountAsync(0).catch(() => {});
			}
		});

		// Notification received while app is foregrounded (optional hook for future)
		receivedListener.current = Notifications.addNotificationReceivedListener(
			async () => {
				// Increment app icon badge when a notification arrives in the foreground.
				// For background notifications, prefer using `badge` in the push payload.
				try {
					const current = await Notifications.getBadgeCountAsync();
					await Notifications.setBadgeCountAsync((current || 0) + 1);
				} catch {}
			}
		);

		// Notification tapped / opened
		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				const data = response?.notification?.request?.content?.data ?? {};
				// Backwards/forwards-compatible routing:
				// - Prefer an explicit `route` if the server provides one.
				// - Otherwise, fall back to legacy `{ type, id }` payloads.
				if (typeof data?.route === 'string' && data.route.length > 0) {
					router.push(data.route);
					return;
				}

				const type = data?.type;

				// Prayer request notifications
				if (
					(type === 'prayer_request' ||
						type === 'prayer_request_like' ||
						type === 'prayer_request_comment') &&
					data?.id
				) {
					router.push(`/prayer-request/${data.id}`);
					return;
				}

				// Event notifications
				if (
					(type === 'event' ||
						type === 'event_like' ||
						type === 'event_comment') &&
					data?.id
				) {
					router.push(`/event/${data.id}`);
				}
			});

		return () => {
			sub.remove();
			if (receivedListener.current) {
				receivedListener.current.remove();
			}
			if (responseListener.current) {
				responseListener.current.remove();
			}
		};
	}, []);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			if (!token) return;

			const prefsLoaded = preferences?.updated_at != null;
			if (!prefsLoaded && !loading && !error) {
				// Ensure we have the server-backed preference before registration.
				dispatch(fetchNotificationPreferences());
				return;
			}

			const notificationsEnabled = preferences?.notifications_enabled === true;
			if (!notificationsEnabled) return;

			const expoPushToken = await registerForPushNotificationsAsync();
			if (cancelled || !expoPushToken) return;

			dispatch(registerPushToken({ expoPushToken }));
		})();

		return () => {
			cancelled = true;
		};
	}, [
		dispatch,
		token,
		preferences?.updated_at,
		preferences?.notifications_enabled,
		error,
		loading,
	]);

	return null;
}

export default Sentry.wrap(function RootLayout() {
	return (
		<Provider store={store}>
			<SafeAreaProvider initialMetrics={initialWindowMetrics}>
				<NotificationBootstrapper />
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="index" />
					<Stack.Screen name="(app)" />
					<Stack.Screen name="(auth)" />
					<Stack.Screen
						name="createEvent"
						options={{
							presentation: 'modal',
							animation: 'slide_from_bottom',
						}}
					/>
					<Stack.Screen
						name="createPrayerRequest"
						options={{
							presentation: 'modal',
							animation: 'slide_from_bottom',
						}}
					/>
					<Stack.Screen
						name="prayer-request/[id]"
						options={{
							animation: 'slide_from_right',
						}}
					/>
					<Stack.Screen
						name="event/[id]"
						options={{
							animation: 'slide_from_right',
						}}
					/>
				</Stack>
			</SafeAreaProvider>
		</Provider>
	);
});
