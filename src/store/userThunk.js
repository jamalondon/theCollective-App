// userThunks.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import ServerAPI from '../API/ServerAPI';
// Navigation is now handled in the Redux slice using expo-router
import { Platform } from 'react-native';
import { getAllEvents, getAttendingEvents, getMyEvents } from './eventThunk';

const EXPO_PUSH_TOKEN_STORAGE_KEY = 'expoPushToken';

// Sign Up Thunk
export const signUpUser = createAsyncThunk(
	'user/signUp',
	async (
		{ name, username, phoneNumber, password, dateOfBirth },
		{ rejectWithValue, dispatch },
	) => {
		try {
			// Validate input
			if (!username || !password || !name || !phoneNumber) {
				throw new Error(
					'Username, password, name, and phone number are required',
				);
			}
			// Keep Redux actions/state serializable (Date objects are not)
			const dateOfBirthIso =
				dateOfBirth instanceof Date ? dateOfBirth.toISOString() : dateOfBirth;
			const response = await ServerAPI.post('/auth/signup', {
				username,
				password,
				name,
				dateOfBirth: dateOfBirthIso,
				phoneNumber,
			});

			// If verification is required, do not store token
			if (response.data?.verificationRequired) {
				return {
					verificationRequired: true,
					phoneNumber: response.data.phoneNumber || phoneNumber,
					userID: response.data.userID || '',
					name,
					dateOfBirth: dateOfBirthIso,
					role: response.data.role || '',
				};
			}

			// Validate response (legacy path)
			if (!response.data || !response.data.token) {
				throw new Error('Invalid server response - missing token');
			}

			await AsyncStorage.setItem('token', response.data.token);

			await Promise.all([
				dispatch(getAllEvents()),
				dispatch(getMyEvents()),
				dispatch(getAttendingEvents()),
			]);

			return {
				token: response.data.token,
				username,
				phoneNumber,
				name,
				userID: response.data.userID || '',
				dateOfBirth: dateOfBirthIso,
				profilePicture: response.data.profilePicture || '',
			};
		} catch (error) {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				return rejectWithValue(
					error.response.data?.message || 'Server error occurred',
				);
			} else if (error.request) {
				// The request was made but no response was received
				return rejectWithValue('No response from server');
			} else {
				// Something happened in setting up the request that triggered an Error
				return rejectWithValue(error.message);
			}
		}
	},
);

// Sign In Thunk
export const signInUser = createAsyncThunk(
	'user/signIn',
	async (
		{ username, password, phoneNumber },
		{ rejectWithValue, dispatch },
	) => {
		try {
			const response = await ServerAPI.post('/auth/signin', {
				username,
				password,
			});

			if (response.data?.verificationRequired) {
				return {
					verificationRequired: true,
					phoneNumber: response.data.phoneNumber || phoneNumber,
					userID: response.data.userID || '',
				};
			}

			if (!response.data || !response.data.token) {
				throw new Error('Invalid server response - missing token');
			}

			await AsyncStorage.setItem('token', response.data.token);
			console.log(response);
			return {
				token: response.data.token,
				username,
				phoneNumber: response.data.phoneNumber || '',
				name: response.data.name || '',
				userID: response.data.userID || '',
				dateOfBirth: response.data.dateOfBirth || '',
				profilePicture: response.data.profilePicture || '',
				role: response.data.role || '',
			};
		} catch (error) {
			if (error.response) {
				return rejectWithValue(
					error.response.data?.message || 'Server error occurred',
				);
			} else if (error.request) {
				return rejectWithValue('No response from server');
			} else {
				return rejectWithValue(error.message);
			}
		}
	},
);

// Try Auto Sign In from stored token
export const tryLocalSignIn = createAsyncThunk(
	'user/localSignIn',
	async (_, { rejectWithValue, dispatch }) => {
		try {
			const token = await AsyncStorage.getItem('token');

			if (!token) {
				return { token: null };
			}

			try {
				// Verify token with server and get user information
				const response = await ServerAPI.post('/auth/verify', { token });

				// fetch events (non-blocking)
				dispatch(getAllEvents());

				return {
					token: response.data.token,
					username: response.data.username,
					phoneNumber: response.data.phoneNumber || '',
					name: response.data.name || '',
					userID: response.data.userID || '',
					dateOfBirth: response.data.dateOfBirth || '',
					profilePicture: response.data.profilePicture || '',
					role: response.data.role || '',
				}; // Return full user data including token
			} catch (error) {
				// If token verification fails, clear it from storage
				await AsyncStorage.removeItem('token');
				throw error;
			}
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					'Failed to restore session',
			);
		}
	},
);

// Sign Out Thunk
export const signOutUser = createAsyncThunk(
	'user/signOut',
	async (_, { rejectWithValue }) => {
		try {
			await AsyncStorage.removeItem('token');
			await AsyncStorage.removeItem(EXPO_PUSH_TOKEN_STORAGE_KEY);
			return {};
		} catch (error) {
			return rejectWithValue(error.message || 'Failed to sign out');
		}
	},
);

// Register/Upsert Expo push token for the authenticated user
export const registerPushToken = createAsyncThunk(
	'user/registerPushToken',
	async ({ expoPushToken }, { rejectWithValue, getState }) => {
		try {
			if (!expoPushToken) {
				return { skipped: true };
			}

			const { user } = getState();
			const token = user.token;

			if (!token) {
				return { skipped: true };
			}

			const lastSaved = await AsyncStorage.getItem(EXPO_PUSH_TOKEN_STORAGE_KEY);
			if (lastSaved && lastSaved === expoPushToken) {
				return { skipped: true, expoPushToken };
			}

			await ServerAPI.post(
				'/users/push-token',
				{
					expoPushToken,
					platform: Platform.OS,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			await AsyncStorage.setItem(EXPO_PUSH_TOKEN_STORAGE_KEY, expoPushToken);
			return { expoPushToken };
		} catch (error) {
			if (error.response) {
				return rejectWithValue(
					error.response.data?.message || 'Failed to register push token',
				);
			} else if (error.request) {
				return rejectWithValue('No response from server');
			} else {
				return rejectWithValue(error.message);
			}
		}
	},
);

// Helper function to ensure proper E.164 phone number format
const formatPhoneNumberForSMS = (phoneNumber) => {
	// Remove any non-digit characters
	const digitsOnly = phoneNumber.replace(/\D/g, '');

	// If it starts with 1 and has 11 digits, add +
	if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
		return '+' + digitsOnly;
	}

	// If it has 10 digits, assume US number and add +1
	if (digitsOnly.length === 10) {
		return '+1' + digitsOnly;
	}

	// If it already starts with +, return as is
	if (phoneNumber.startsWith('+')) {
		return phoneNumber;
	}

	// Default: add + if not present
	return phoneNumber.startsWith('+') ? phoneNumber : '+' + digitsOnly;
};

// Send Verification SMS
export const sendVerificationSms = createAsyncThunk(
	'user/sendVerificationSms',
	async ({ phoneNumber }, { rejectWithValue }) => {
		try {
			console.log('phoneNumber', phoneNumber);
			const formattedPhone = formatPhoneNumberForSMS(phoneNumber);
			console.log('formattedPhone', formattedPhone);
			const payload = {
				to: formattedPhone,
				phoneNumber: formattedPhone, // Try both field names
			};

			const response = await ServerAPI.post('/auth/start-verify', payload);
			return { message: response.data?.message || 'Verification SMS sent' };
		} catch (error) {
			if (error.response) {
				return rejectWithValue(
					error.response.data?.message || 'Server error occurred',
				);
			} else if (error.request) {
				return rejectWithValue('No response from server');
			} else {
				return rejectWithValue(error.message);
			}
		}
	},
);

// Verify SMS Code
export const verifySmsCode = createAsyncThunk(
	'user/verifySmsCode',
	async ({ phoneNumber, code }, { rejectWithValue }) => {
		try {
			const formattedPhone = formatPhoneNumberForSMS(phoneNumber);

			const response = await ServerAPI.post('/auth/check-verify', {
				to: formattedPhone,
				phoneNumber: formattedPhone, // Try both field names
				code,
			});

			if (!response.data || !response.data.token) {
				throw new Error('Invalid server response - missing token');
			}

			await AsyncStorage.setItem('token', response.data.token);
			return {
				token: response.data.token,
				username: response.data.username,
				phoneNumber: response.data.phoneNumber || '',
				name: response.data.name || '',
				userID: response.data.userID || '',
				dateOfBirth: response.data.dateOfBirth || '',
				profilePicture: response.data.profilePicture || '',
				role: response.data.role || '',
			};
		} catch (error) {
			if (error.response) {
				return rejectWithValue(
					error.response.data?.message || 'Invalid or expired code',
				);
			} else if (error.request) {
				return rejectWithValue('No response from server');
			} else {
				return rejectWithValue(error.message);
			}
		}
	},
);

// Get News Feed (combined events and prayer requests)
export const getNewsFeed = createAsyncThunk(
	'user/getNewsFeed',
	async (_, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;

			if (!token) {
				throw new Error('No authentication token found');
			}

			const response = await ServerAPI.get('/users/news-feed', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.data || !response.data.data) {
				throw new Error('Invalid server response');
			}

			return {
				feed: response.data.data.feed || [],
				counts: response.data.data.counts || {
					prayerRequests: 0,
					events: 0,
					total: 0,
				},
			};
		} catch (error) {
			if (error.response) {
				return rejectWithValue(
					error.response.data?.message || 'Failed to fetch news feed',
				);
			} else if (error.request) {
				return rejectWithValue('No response from server');
			} else {
				return rejectWithValue(error.message);
			}
		}
	},
);

// Fetch User Profile with Activity Summary
export const fetchUserProfile = createAsyncThunk(
	'user/fetchProfile',
	async (_, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;

			if (!token) {
				throw new Error('No authentication token found');
			}

			const response = await ServerAPI.get('/users/profile', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.data || !response.data) {
				throw new Error('Invalid server response');
			}

			return {
				user: response.data.user,
				activitySummary: response.data.activitySummary,
			};
		} catch (error) {
			if (error.response) {
				return rejectWithValue(
					error.response.data?.message || 'Failed to fetch profile',
				);
			} else if (error.request) {
				return rejectWithValue('No response from server');
			} else {
				return rejectWithValue(error.message);
			}
		}
	},
);

// Upload Profile Picture
export const uploadProfilePicture = createAsyncThunk(
	'user/uploadProfilePicture',
	async ({ imageUri }, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;

			if (!token) {
				throw new Error('No authentication token found');
			}

			// Create form data for the image upload
			const formData = new FormData();
			const filename = imageUri.split('/').pop();
			const match = /\.(\w+)$/.exec(filename);
			const type = match ? `image/${match[1]}` : 'image/jpeg';

			formData.append('profilePicture', {
				uri: imageUri,
				name: filename,
				type,
			});

			const response = await ServerAPI.post(
				'/users/upload-profile-picture',
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
				},
			);

			return {
				profilePictureUrl: response.data.profilePictureUrl,
			};
		} catch (error) {
			if (error.response) {
				return rejectWithValue(
					error.response.data?.message || 'Failed to upload profile picture',
				);
			} else if (error.request) {
				return rejectWithValue('No response from server');
			} else {
				return rejectWithValue(error.message);
			}
		}
	},
);
