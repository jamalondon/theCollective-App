import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Pressable,
	Platform,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../src/components/Icon';
import { useTheme, useThemedStyles } from '../src/hooks/useThemedStyles';
import { pressableOpacityStyle } from '../src/utils/pressableOpacityStyle';
import {
	clearLocationSearchResults,
	clearSearchResults,
} from '../src/store/eventSlice';
import {
	createEvent,
	searchGooglePlaces,
	searchUsers,
} from '../src/store/eventThunk';

export default function CreateEvent() {
	// Form state
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [location, setLocation] = useState('');
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [locationQuery, setLocationQuery] = useState('');
	const [showLocationResults, setShowLocationResults] = useState(false);
	const [attendees, setAttendees] = useState([]);
	const [attendeeSearchQuery, setAttendeeSearchQuery] = useState('');

	// Hooks
	const { colors, isDarkMode } = useTheme();
	const { createEventStyles } = useThemedStyles();
	const {
		isLoading,
		searchResults,
		defaultLocations,
		locationSearchResults,
		locationSearchLoading,
	} = useSelector((state) => state.events);
	const dispatch = useDispatch();
	const insets = useSafeAreaInsets();

	// Filter default locations based on query + combine with Google results
	const filteredLocations = useMemo(() => {
		if (!locationQuery.trim()) {
			// Show all default locations when no query
			return defaultLocations;
		}

		const query = locationQuery.toLowerCase();

		// Filter default locations that match the query
		const matchingDefaults = (defaultLocations || []).filter(
			(loc) =>
				loc.name?.toLowerCase().includes(query) ||
				loc.address?.toLowerCase().includes(query) ||
				loc.city?.toLowerCase().includes(query)
		);

		// Combine with Google Places results (avoiding duplicates by address)
		const defaultAddresses = new Set(
			matchingDefaults.map((loc) => loc.address?.toLowerCase())
		);
		const uniqueGoogleResults = (locationSearchResults || []).filter(
			(loc) => !defaultAddresses.has(loc.address?.toLowerCase())
		);

		return [...matchingDefaults, ...uniqueGoogleResults];
	}, [locationQuery, defaultLocations, locationSearchResults]);

	// Dismiss location results when tapping outside
	const dismissLocationResults = () => {
		setShowLocationResults(false);
	};

	// Date/Time handlers
	const onDateChange = (event, selectedDate) => {
		setShowDatePicker(Platform.OS === 'ios');
		if (selectedDate) {
			setDate(selectedDate);
		}
	};

	const onTimeChange = (event, selectedTime) => {
		setShowTimePicker(Platform.OS === 'ios');
		if (selectedTime) {
			const newDate = new Date(date);
			newDate.setHours(selectedTime.getHours());
			newDate.setMinutes(selectedTime.getMinutes());
			setDate(newDate);
		}
	};

	const formatDateTime = (dateObj) => {
		return dateObj.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	};

	// Attendee search handlers
	const handleSearchAttendees = (query) => {
		setAttendeeSearchQuery(query);
		if (query.trim().length > 0) {
			dispatch(searchUsers(query));
		} else {
			dispatch(clearSearchResults());
		}
	};

	const addAttendee = (user) => {
		// Check if user is already added
		if (!attendees.find((a) => a.id === user.id)) {
			setAttendees([...attendees, user]);
		}
		setAttendeeSearchQuery('');
		dispatch(clearSearchResults());
		Keyboard.dismiss();
	};

	const removeAttendee = (userId) => {
		setAttendees(attendees.filter((a) => a.id !== userId));
	};

	// Location search handlers
	const handleLocationSearch = (query) => {
		setLocationQuery(query);
		setLocation(query);
		setSelectedLocation(null);
		setShowLocationResults(true);

		// Search Google Places if query is 3+ characters
		if (query.trim().length >= 3) {
			dispatch(searchGooglePlaces(query));
		} else {
			dispatch(clearLocationSearchResults());
		}
	};

	const selectLocation = (loc) => {
		console.log('selectLocation', loc);
		setSelectedLocation(loc);
		setLocation(loc.name || loc.address);
		setLocationQuery('');
		setShowLocationResults(false);
		dispatch(clearLocationSearchResults());
		Keyboard.dismiss();
	};

	// Form validation
	const isFormValid = () => {
		return title.trim() && description.trim() && location.trim();
	};

	// Submit handler
	const handleSubmit = async () => {
		if (!isFormValid()) {
			Alert.alert('Validation Error', 'Please fill in all required fields.');
			return;
		}

		try {
			const eventData = {
				title: title.trim(),
				description: description.trim(),
				date: date.toISOString(),
				location: selectedLocation
					? {
							name: selectedLocation.name,
							address: selectedLocation.address,
							city: selectedLocation.city || null,
							state: selectedLocation.state || null,
							latitude: selectedLocation.latitude || null,
							longitude: selectedLocation.longitude || null,
					  }
					: { name: location.trim() },
				attendees: attendees.map((a) => a.id),
			};

			await dispatch(createEvent(eventData)).unwrap();

			// Success - navigate back
			router.back();
		} catch (error) {
			Alert.alert(
				'Error',
				error?.message || 'Failed to create event. Please try again.'
			);
		}
	};

	return (
		<KeyboardAvoidingView
			style={[
				createEventStyles.container,
				{
					paddingTop: insets.top,
					paddingLeft: insets.left,
					paddingRight: insets.right,
				},
			]}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			//keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
		>
			{/* Header */}
			<View style={createEventStyles.header}>
				<Pressable
					onPress={() => router.back()}
					style={pressableOpacityStyle({ style: null })}
				>
					<Icon.IoniconsIcon
						name="arrow-back"
						size={28}
						color={colors.primary}
					/>
				</Pressable>
				<Text style={createEventStyles.headerTitle}>Create Event</Text>
			</View>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={createEventStyles.scrollContent}
				keyboardShouldPersistTaps="handled"
				automaticallyAdjustKeyboardInsets={true}
				onScrollBeginDrag={dismissLocationResults}
			>
				{/* Title */}
				<Text style={createEventStyles.label}>Title *</Text>
				<TextInput
					style={createEventStyles.input}
					placeholder="Event title"
					placeholderTextColor={colors.text.secondary}
					value={title}
					onChangeText={setTitle}
					onFocus={dismissLocationResults}
					autoCorrect={false}
				/>

				{/* Description */}
				<Text style={createEventStyles.label}>Description *</Text>
				<TextInput
					style={[createEventStyles.input, createEventStyles.multilineInput]}
					placeholder="What's this event about?"
					placeholderTextColor={colors.text.secondary}
					value={description}
					onChangeText={setDescription}
					onFocus={dismissLocationResults}
					multiline
					textAlignVertical="top"
				/>

				{/* Date & Time */}
				<Text style={createEventStyles.label}>Date & Time *</Text>
				<Pressable
					onPress={() => setShowDatePicker(true)}
					style={pressableOpacityStyle({
						style: createEventStyles.dateButton,
					})}
				>
					<Text style={createEventStyles.dateButtonText}>
						{formatDateTime(date)}
					</Text>
					<Icon.IoniconsIcon
						name="calendar"
						size={20}
						color={colors.text.secondary}
					/>
				</Pressable>

				{showDatePicker && (
					<View style={{ alignItems: 'center', width: '100%' }}>
						<DateTimePicker
							value={date}
							mode="date"
							display={Platform.OS === 'ios' ? 'spinner' : 'default'}
							onChange={onDateChange}
							minimumDate={new Date()}
							themeVariant={
								Platform.OS === 'ios'
									? isDarkMode
										? 'dark'
										: 'light'
									: undefined
							}
							textColor={
								Platform.OS === 'ios' ? colors.text.primary : undefined
							}
							style={Platform.OS === 'ios' ? { width: '100%' } : undefined}
						/>
					</View>
				)}

				{Platform.OS === 'ios' && showDatePicker && (
					<Pressable
						onPress={() => {
							setShowDatePicker(false);
							setShowTimePicker(true);
						}}
						style={pressableOpacityStyle({
							style: [createEventStyles.submitButton, { marginTop: 8 }],
						})}
					>
						<Text style={createEventStyles.submitButtonText}>Select Time</Text>
					</Pressable>
				)}

				{showTimePicker && (
					<View style={{ alignItems: 'center', width: '100%' }}>
						<DateTimePicker
							value={date}
							mode="time"
							display={Platform.OS === 'ios' ? 'spinner' : 'default'}
							onChange={onTimeChange}
							themeVariant={
								Platform.OS === 'ios'
									? isDarkMode
										? 'dark'
										: 'light'
									: undefined
							}
							textColor={
								Platform.OS === 'ios' ? colors.text.primary : undefined
							}
							style={Platform.OS === 'ios' ? { width: '100%' } : undefined}
						/>
					</View>
				)}

				{Platform.OS === 'ios' && showTimePicker && (
					<Pressable
						onPress={() => setShowTimePicker(false)}
						style={pressableOpacityStyle({
							style: [createEventStyles.submitButton, { marginTop: 8 }],
						})}
					>
						<Text style={createEventStyles.submitButtonText}>Done</Text>
					</Pressable>
				)}

				{/* Location */}
				<Text style={createEventStyles.label}>Location *</Text>
				<TextInput
					style={createEventStyles.input}
					placeholder="Search for a location"
					placeholderTextColor={colors.text.secondary}
					value={location}
					onChangeText={handleLocationSearch}
					onFocus={() => setShowLocationResults(true)}
					autoCorrect={false}
				/>

				{/* Location Search Results */}
				{showLocationResults && filteredLocations.length > 0 && (
					<ScrollView
						style={createEventStyles.searchResultsContainer}
						nestedScrollEnabled
						keyboardShouldPersistTaps="handled"
					>
						{locationSearchLoading && (
							<View style={{ padding: 10, alignItems: 'center' }}>
								<ActivityIndicator size="small" color={colors.primary} />
							</View>
						)}
						{filteredLocations.map((loc) => (
							<Pressable
								key={loc.id}
								onPress={() => selectLocation(loc)}
								style={pressableOpacityStyle({
									style: createEventStyles.searchResultItem,
								})}
							>
								<Icon.IoniconsIcon
									name={loc.isGooglePlace ? 'location' : 'business'}
									size={20}
									color={colors.text.secondary}
									style={{ marginRight: 10 }}
								/>
								<View style={createEventStyles.searchResultTextContainer}>
									<Text style={createEventStyles.searchResultText}>
										{loc.name}
									</Text>
									<Text
										style={[
											createEventStyles.searchResultText,
											{ fontSize: 12, color: colors.text.secondary },
										]}
									>
										{loc.address}
										{loc.city ? `, ${loc.city}` : ''}
										{loc.state ? `, ${loc.state}` : ''}
									</Text>
								</View>
							</Pressable>
						))}
					</ScrollView>
				)}

				{/* Attendees */}
				<Text style={createEventStyles.label}>Invite Attendees</Text>
				<TextInput
					style={createEventStyles.input}
					placeholder="Search users to invite"
					placeholderTextColor={colors.text.secondary}
					value={attendeeSearchQuery}
					onChangeText={handleSearchAttendees}
					onFocus={dismissLocationResults}
					autoCorrect={false}
				/>

				{/* Search Results */}
				{searchResults?.length > 0 && (
					<ScrollView
						style={createEventStyles.searchResultsContainer}
						nestedScrollEnabled
					>
						{searchResults.map((user) => (
							<Pressable
								key={user.id}
								onPress={() => addAttendee(user)}
								style={pressableOpacityStyle({
									style: createEventStyles.searchResultItem,
								})}
							>
								<Image
									source={{ uri: user.profile_picture }}
									style={createEventStyles.searchResultImage}
								/>
								<View style={createEventStyles.searchResultTextContainer}>
									<Text style={createEventStyles.searchResultText}>
										{user.full_name || `${user.firstName} ${user.lastName}`}
										{user.username ? ` (@${user.username})` : ''}
									</Text>
								</View>
							</Pressable>
						))}
					</ScrollView>
				)}

				{/* Selected Attendees */}
				{attendees.length > 0 && (
					<View style={createEventStyles.attendeeContainer}>
						<View style={createEventStyles.attendeeChipContainer}>
							{attendees.map((attendee) => (
								<View key={attendee.id} style={createEventStyles.attendeeChip}>
									<Text style={createEventStyles.attendeeChipText}>
										{attendee.full_name ||
											`${attendee.firstName} ${attendee.lastName}`}
									</Text>
									<Pressable
										onPress={() => removeAttendee(attendee.id)}
										style={pressableOpacityStyle({ style: null })}
									>
										<Icon.IoniconsIcon
											name="close-circle"
											size={18}
											color={colors.postTypes.event.tagText}
										/>
									</Pressable>
								</View>
							))}
						</View>
					</View>
				)}

				{/* Submit Button */}
				<Pressable
					disabled={!isFormValid() || isLoading}
					onPress={handleSubmit}
					style={pressableOpacityStyle({
						style: [
							createEventStyles.submitButton,
							!isFormValid() && createEventStyles.submitButtonDisabled,
						],
						disabled: !isFormValid() || isLoading,
					})}
				>
					{isLoading ? (
						<ActivityIndicator color={colors.text.button} />
					) : (
						<Text style={createEventStyles.submitButtonText}>Create Event</Text>
					)}
				</Pressable>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
