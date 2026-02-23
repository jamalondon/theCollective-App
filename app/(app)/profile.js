import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Modal,
	Pressable,
	ScrollView,
	Switch,
	Text,
	useColorScheme,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { AuthStyles } from '../../src/constants/styles';
import { pressableOpacityStyle } from '../../src/utils/pressableOpacityStyle';
import {
	fetchNotificationPreferences,
	resetNotificationPreferences,
	updateNotificationPreferences,
} from '../../src/store/notificationPreferencesThunk';
import { selectTheme, setSystemTheme, setTheme } from '../../src/store/themeSlice';
import { updateUserPreferences } from '../../src/store/userPreferencesThunk';
import {
	fetchUserProfile,
	signOutUser,
	uploadProfilePicture,
} from '../../src/store/userThunk';

export default function ProfileScreen() {
	const dispatch = useDispatch();
	const systemColorScheme = useColorScheme();
	const { colors, isDarkMode, isSystemTheme } = useSelector(selectTheme);
	const {
		name,
		username,
		profilePicture,
		activitySummary,
		profileLoading,
		profileError,
		uploadingProfilePicture,
		token,
	} = useSelector((state) => state.user);

	const {
		loading: notificationPreferencesLoading,
		saving: notificationPreferencesSaving,
		error: notificationPreferencesError,
		preferences: notificationPreferences,
	} = useSelector((state) => state.notificationPreferences);

	const [settingsModalVisible, setSettingsModalVisible] = useState(false);
	const styles = AuthStyles(colors).profileStyles;

	// Fetch user profile whenever the screen comes into focus
	useFocusEffect(
		useCallback(() => {
			dispatch(fetchUserProfile());
		}, [dispatch])
	);

	const handlePickImage = async () => {
		// Request permission
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert(
				'Sorry, we need camera roll permissions to upload a profile picture.'
			);
			return;
		}

		// Launch image picker
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled && result.assets[0]) {
			dispatch(uploadProfilePicture({ imageUri: result.assets[0].uri }));
		}
	};

	const handleSignOut = () => {
		setSettingsModalVisible(false);
		dispatch(signOutUser());
	};

	const handleToggleTheme = () => {
		const newDarkMode = !isDarkMode;
		dispatch(setTheme(newDarkMode));
		dispatch(updateUserPreferences({ useSystemTheme: false, darkMode: newDarkMode }));
	};

	const handleToggleSystemTheme = (value) => {
		if (value) {
			const systemIsDark = systemColorScheme === 'dark';
			dispatch(setSystemTheme(systemIsDark));
			dispatch(updateUserPreferences({ useSystemTheme: true }));
		} else {
			dispatch(setTheme(isDarkMode));
			dispatch(updateUserPreferences({ useSystemTheme: false, darkMode: isDarkMode }));
		}
	};

	const handleRetry = () => {
		dispatch(fetchUserProfile());
	};

	const prefsLoaded = notificationPreferences?.updated_at != null;
	const notificationsEnabled = notificationPreferences?.notifications_enabled === true;

	const switchesDisabled =
		!token || notificationPreferencesLoading || notificationPreferencesSaving;
	const categorySwitchesDisabled = switchesDisabled || !notificationsEnabled;

	useEffect(() => {
		if (!settingsModalVisible) return;
		if (!token) return;
		// Avoid auto-retrying forever if the endpoint is failing; user can tap Refresh/Retry.
		if (!prefsLoaded && !notificationPreferencesLoading && !notificationPreferencesError) {
			dispatch(fetchNotificationPreferences());
		}
	}, [
		dispatch,
		settingsModalVisible,
		token,
		prefsLoaded,
		notificationPreferencesLoading,
		notificationPreferencesError,
	]);

	if (profileLoading && !name) {
		return (
			<SafeAreaView style={styles.container} edges={['top']}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</SafeAreaView>
		);
	}

	if (profileError && !name) {
		return (
			<SafeAreaView style={styles.container} edges={['top']}>
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{profileError}</Text>
					<Pressable
						onPress={handleRetry}
						style={pressableOpacityStyle({ style: styles.retryButton })}
					>
						<Text style={styles.retryButtonText}>Retry</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Header with Settings Button */}
				<View style={styles.header}>
					<Pressable
						onPress={() => setSettingsModalVisible(true)}
						style={pressableOpacityStyle({ style: styles.settingsButton })}
					>
						<Ionicons
							name="settings-outline"
							size={26}
							color={colors.text.primary}
						/>
					</Pressable>
				</View>

				{/* Profile Section */}
				<View style={styles.profileSection}>
					<View style={styles.profilePictureContainer}>
						{profilePicture ? (
							<Image
								source={{ uri: profilePicture }}
								style={styles.profilePicture}
							/>
						) : (
							<View style={styles.profilePicturePlaceholder}>
								<Ionicons
									name="person"
									size={50}
									color={colors.text.secondary}
								/>
							</View>
						)}
						{uploadingProfilePicture && (
							<View style={styles.uploadingOverlay}>
								<ActivityIndicator size="small" color="#ffffff" />
							</View>
						)}
					</View>

					<Text style={styles.fullName}>{name || 'User'}</Text>
					<Text style={styles.username}>@{username || 'username'}</Text>
				</View>

				{/* Stats Section */}
				<View style={styles.statsContainer}>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>
							{activitySummary.friends || 0}
						</Text>
						<Text style={styles.statLabel}>Friends</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>
							{activitySummary.prayerRequestsCreated || 0}
						</Text>
						<Text style={styles.statLabel}>Prayers{'\n'}Created</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>
							{activitySummary.eventsCreated || 0}
						</Text>
						<Text style={styles.statLabel}>Events{'\n'}Created</Text>
					</View>
				</View>
			</ScrollView>

			{/* Settings Modal */}
			<Modal
				visible={settingsModalVisible}
				transparent
				animationType="slide"
				onRequestClose={() => setSettingsModalVisible(false)}
			>
				<Pressable
					onPress={() => setSettingsModalVisible(false)}
					style={pressableOpacityStyle({
						style: styles.modalOverlay,
						activeOpacity: 1,
					})}
				>
					<Pressable
						onPress={(e) => e.stopPropagation()}
						style={pressableOpacityStyle({
							style: styles.modalContent,
							activeOpacity: 1,
						})}
					>
						{/* Modal Header */}
						<View style={styles.modalHeader}>
							<View style={styles.modalHandle} />
							<Text style={styles.modalTitle}>Settings</Text>
						</View>

						{/* Modal Body */}
						<View style={styles.modalBody}>
							{/* Upload Profile Picture */}
							<Pressable
								onPress={handlePickImage}
								disabled={uploadingProfilePicture}
								style={pressableOpacityStyle({
									style: styles.settingsOption,
									disabled: uploadingProfilePicture,
								})}
							>
								<View style={styles.settingsOptionLeft}>
									<Ionicons
										name="camera-outline"
										size={24}
										color={colors.text.primary}
										style={styles.settingsOptionIcon}
									/>
									<View>
										<Text style={styles.settingsOptionText}>
											Change Profile Picture
										</Text>
										<Text style={styles.settingsOptionSubtext}>
											Upload a new photo
										</Text>
									</View>
								</View>
								{uploadingProfilePicture ? (
									<ActivityIndicator size="small" color={colors.primary} />
								) : (
									<Ionicons
										name="chevron-forward"
										size={20}
										color={colors.text.secondary}
									/>
								)}
							</Pressable>

							{/* Use Device Default */}
							<View style={styles.settingsOption}>
								<View style={styles.settingsOptionLeft}>
									<Ionicons
										name="phone-portrait-outline"
										size={24}
										color={colors.text.primary}
										style={styles.settingsOptionIcon}
									/>
									<View>
										<Text style={styles.settingsOptionText}>
											Use Device Default
										</Text>
										<Text style={styles.settingsOptionSubtext}>
											{isSystemTheme
												? 'Following device setting'
												: 'Using manual setting'}
										</Text>
									</View>
								</View>
								<Switch
									value={isSystemTheme}
									onValueChange={handleToggleSystemTheme}
									trackColor={{
										false: colors.border.default,
										true: colors.primary,
									}}
									thumbColor="#ffffff"
								/>
							</View>

							{/* Dark Mode Toggle */}
							<View
								style={[
									styles.settingsOption,
									isSystemTheme && { opacity: 0.5 },
								]}
							>
								<View style={styles.settingsOptionLeft}>
									<Ionicons
										name={isDarkMode ? 'moon' : 'sunny-outline'}
										size={24}
										color={colors.text.primary}
										style={styles.settingsOptionIcon}
									/>
									<View>
										<Text style={styles.settingsOptionText}>Dark Mode</Text>
										<Text style={styles.settingsOptionSubtext}>
											{isDarkMode ? 'Currently enabled' : 'Currently disabled'}
											{isSystemTheme ? ' (auto)' : ''}
										</Text>
									</View>
								</View>
								<Switch
									value={isDarkMode}
									onValueChange={handleToggleTheme}
									disabled={isSystemTheme}
									trackColor={{
										false: colors.border.default,
										true: colors.primary,
									}}
									thumbColor="#ffffff"
								/>
							</View>

							{/* Notifications */}
							<View style={{ marginTop: 10 }}>
								<Text
									style={[
										styles.settingsOptionText,
										{ marginBottom: 8, color: colors.text.primary },
									]}
								>
									Notifications
								</Text>

								<View style={styles.settingsOption}>
									<View style={styles.settingsOptionLeft}>
										<Ionicons
											name="notifications-outline"
											size={24}
											color={colors.text.primary}
											style={styles.settingsOptionIcon}
										/>
										<View>
											<Text style={styles.settingsOptionText}>
												Notifications
											</Text>
											<Text style={styles.settingsOptionSubtext}>
												{!token
													? 'Sign in to manage preferences'
													: !prefsLoaded && notificationPreferencesLoading
														? 'Loading…'
														: notificationsEnabled
															? 'Enabled'
															: 'Disabled'}
											</Text>
										</View>
									</View>
									{!prefsLoaded && notificationPreferencesLoading ? (
										<ActivityIndicator size="small" color={colors.primary} />
									) : (
										<Switch
											value={Boolean(
												notificationPreferences?.notifications_enabled
											)}
											disabled={switchesDisabled || !prefsLoaded}
											onValueChange={(value) =>
												dispatch(
													updateNotificationPreferences({
														notifications_enabled: value,
													})
												)
											}
											trackColor={{
												false: colors.border.default,
												true: colors.primary,
											}}
											thumbColor="#ffffff"
										/>
									)}
								</View>

								<View style={styles.settingsOption}>
									<View style={styles.settingsOptionLeft}>
										<Ionicons
											name="calendar-outline"
											size={24}
											color={
												categorySwitchesDisabled
													? colors.text.secondary
													: colors.text.primary
											}
											style={styles.settingsOptionIcon}
										/>
										<View>
											<Text
												style={[
													styles.settingsOptionText,
													categorySwitchesDisabled && {
														color: colors.text.secondary,
													},
												]}
											>
												Event notifications
											</Text>
											<Text style={styles.settingsOptionSubtext}>
												Invites, updates, and activity
											</Text>
										</View>
									</View>
									<Switch
										value={Boolean(notificationPreferences?.event_notifications)}
										disabled={categorySwitchesDisabled || !prefsLoaded}
										onValueChange={(value) =>
											dispatch(
												updateNotificationPreferences({
													event_notifications: value,
												})
											)
										}
										trackColor={{
											false: colors.border.default,
											true: colors.primary,
										}}
										thumbColor="#ffffff"
									/>
								</View>

								<View style={styles.settingsOption}>
									<View style={styles.settingsOptionLeft}>
										<Ionicons
											name="heart-outline"
											size={24}
											color={
												categorySwitchesDisabled
													? colors.text.secondary
													: colors.text.primary
											}
											style={styles.settingsOptionIcon}
										/>
										<View>
											<Text
												style={[
													styles.settingsOptionText,
													categorySwitchesDisabled && {
														color: colors.text.secondary,
													},
												]}
											>
												Prayer notifications
											</Text>
											<Text style={styles.settingsOptionSubtext}>
												Likes and comments
											</Text>
										</View>
									</View>
									<Switch
										value={Boolean(notificationPreferences?.prayer_notifications)}
										disabled={categorySwitchesDisabled || !prefsLoaded}
										onValueChange={(value) =>
											dispatch(
												updateNotificationPreferences({
													prayer_notifications: value,
												})
											)
										}
										trackColor={{
											false: colors.border.default,
											true: colors.primary,
										}}
										thumbColor="#ffffff"
									/>
								</View>

								<View style={styles.settingsOption}>
									<View style={styles.settingsOptionLeft}>
										<Ionicons
											name="people-outline"
											size={24}
											color={
												categorySwitchesDisabled
													? colors.text.secondary
													: colors.text.primary
											}
											style={styles.settingsOptionIcon}
										/>
										<View>
											<Text
												style={[
													styles.settingsOptionText,
													categorySwitchesDisabled && {
														color: colors.text.secondary,
													},
												]}
											>
												Social notifications
											</Text>
											<Text style={styles.settingsOptionSubtext}>
												Follows and interactions
											</Text>
										</View>
									</View>
									<Switch
										value={Boolean(notificationPreferences?.social_notifications)}
										disabled={categorySwitchesDisabled || !prefsLoaded}
										onValueChange={(value) =>
											dispatch(
												updateNotificationPreferences({
													social_notifications: value,
												})
											)
										}
										trackColor={{
											false: colors.border.default,
											true: colors.primary,
										}}
										thumbColor="#ffffff"
									/>
								</View>

								<View style={{ marginTop: 6 }}>
									{notificationPreferencesError ? (
										<Text style={[styles.errorText, { marginBottom: 8 }]}>
											{notificationPreferencesError}
										</Text>
									) : null}

									{token ? (
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'flex-start',
											}}
										>
											<Pressable
												onPress={() => dispatch(fetchNotificationPreferences())}
												disabled={switchesDisabled}
												style={pressableOpacityStyle({
													style: [styles.retryButton, { marginRight: 10 }],
													disabled: switchesDisabled,
												})}
											>
												<Text style={styles.retryButtonText}>
													{prefsLoaded ? 'Refresh' : 'Retry'}
												</Text>
											</Pressable>
											<Pressable
												onPress={() => dispatch(resetNotificationPreferences())}
												disabled={switchesDisabled}
												style={pressableOpacityStyle({
													style: styles.retryButton,
													disabled: switchesDisabled,
												})}
											>
												<Text style={styles.retryButtonText}>
													Reset to defaults
												</Text>
											</Pressable>
										</View>
									) : null}
								</View>
							</View>

							{/* Sign Out Button */}
							<Pressable
								onPress={handleSignOut}
								style={pressableOpacityStyle({ style: styles.signOutButton })}
							>
								<Ionicons name="log-out-outline" size={22} color="#ffffff" />
								<Text style={styles.signOutButtonText}>Sign Out</Text>
							</Pressable>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
		</SafeAreaView>
	);
}
