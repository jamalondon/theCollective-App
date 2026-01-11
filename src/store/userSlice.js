import { createSlice } from '@reduxjs/toolkit';
import { router } from 'expo-router';

import { deleteEvent, likeEvent, unlikeEvent } from './eventThunk';
import {
	deletePrayerRequest,
	likePrayerRequest,
	unlikePrayerRequest,
} from './prayerRequestThunk';
import {
	fetchUserProfile,
	getNewsFeed,
	registerPushToken,
	sendVerificationSms,
	signInUser,
	signOutUser,
	signUpUser,
	tryLocalSignIn,
	uploadProfilePicture,
	verifySmsCode,
} from './userThunk';

// Create a slice for user data
const userSlice = createSlice({
	name: 'user',
	initialState: {
		name: '',
		username: '',
		phoneNumber: '',
		token: '',
		userID: '',
		errorMessage: '',
		isVerificationRequired: false,
		preferences: {
			darkMode: false,
		},
		dateOfBirth: '',
		profilePicture: '',
		role: '',
		expoPushToken: '',
		pushTokenError: '',
		newsFeed: [],
		newsFeedLoading: false,
		newsFeedError: '',
		newsFeedCounts: {
			prayerRequests: 0,
			events: 0,
			total: 0,
		},
		// Profile state
		activitySummary: {
			prayerRequestsCreated: 0,
			prayerRequestsCommented: 0,
			eventsAttended: 0,
			sermonDiscussionsParticipated: 0,
			eventsCreated: 0,
			friends: 0,
		},
		profileLoading: false,
		profileError: '',
		uploadingProfilePicture: false,
	},
	reducers: {
		// Actions that modify state
		// Note: This looks like we're mutating state, but Redux Toolkit uses Immer under the hood
		// which converts these "mutations" into immutable updates
		clearError: (state) => {
			state.errorMessage = '';
		},
		setErrorMessage: (state, action) => {
			state.errorMessage = action.payload;
		},
		clearVerificationState: (state) => {
			state.isVerificationRequired = false;
			state.errorMessage = '';
		},
	},
	extraReducers: (builder) => {
		// Sign In cases
		builder.addCase(signInUser.pending, (state) => {
			state.errorMessage = '';
		});
		builder.addCase(signInUser.fulfilled, (state, action) => {
			state.errorMessage = '';
			if (action.payload.verificationRequired) {
				state.isVerificationRequired = true;
				state.phoneNumber = action.payload.phoneNumber;
				return;
			}
			state.token = action.payload.token;
			state.username = action.payload.username;
			state.phoneNumber = action.payload.phoneNumber || '';
			state.userID = action.payload.userID || '';
			state.name = action.payload.name;
			state.dateOfBirth = action.payload.dateOfBirth || '';
			state.profilePicture = action.payload.profilePicture || '';
			router.replace('/(app)');
		});
		builder.addCase(signInUser.rejected, (state, action) => {
			state.errorMessage = action.payload || 'Sign in failed';
		});

		// Sign Up cases
		builder.addCase(signUpUser.pending, (state) => {
			state.errorMessage = '';
		});
		builder.addCase(signUpUser.fulfilled, (state, action) => {
			state.errorMessage = '';
			if (action.payload.verificationRequired) {
				state.isVerificationRequired = true;
				state.phoneNumber = action.payload.phoneNumber;
				return;
			}
			state.token = action.payload.token;
			state.username = action.payload.username;
			state.phoneNumber = action.payload.phoneNumber || '';
			state.name = action.payload.name;
			state.userID = action.payload.userID || '';
			state.profilePicture = action.payload.profilePicture || '';
			router.replace('/(app)');
		});
		builder.addCase(signUpUser.rejected, (state, action) => {
			console.log('Sign up failed', action.payload);
			state.errorMessage = action.payload || 'Sign up failed';
		});

		// Local Sign In cases
		builder.addCase(tryLocalSignIn.pending, (state) => {});
		builder.addCase(tryLocalSignIn.fulfilled, (state, action) => {
			state.token = action.payload.token;
			state.username = action.payload.username;
			state.phoneNumber = action.payload.phoneNumber || '';
			state.name = action.payload.name;
			state.userID = action.payload.userID || '';
			state.dateOfBirth = action.payload.dateOfBirth || '';
			state.profilePicture = action.payload.profilePicture || '';
			state.errorMessage = '';
		});
		builder.addCase(tryLocalSignIn.rejected, (state) => {
			// We don't set an error message here as this is a background operation
		});

		// Sign Out cases
		builder.addCase(signOutUser.fulfilled, (state) => {
			state.name = '';
			state.username = '';
			state.phoneNumber = '';
			state.token = '';
			state.userID = '';
			state.errorMessage = '';
			state.isVerificationRequired = false;
			state.expoPushToken = '';
			state.pushTokenError = '';
			//redirect back to auth
			router.replace('/(auth)/welcome');
		});

		// SMS Verification flow
		builder.addCase(verifySmsCode.pending, (state) => {
			state.errorMessage = '';
		});
		builder.addCase(verifySmsCode.fulfilled, (state, action) => {
			state.token = action.payload.token;
			state.username = action.payload.username;
			state.phoneNumber = action.payload.phoneNumber || '';
			state.userID = action.payload.userID || '';
			state.name = action.payload.name || '';
			state.dateOfBirth = action.payload.dateOfBirth || '';
			state.profilePicture = action.payload.profilePicture || '';
			state.isVerificationRequired = false;
			state.errorMessage = '';
			router.replace('/(app)');
		});
		builder.addCase(verifySmsCode.rejected, (state, action) => {
			state.errorMessage = action.payload || 'Invalid or expired code';
		});

		builder.addCase(sendVerificationSms.pending, (state) => {
			state.errorMessage = '';
		});
		builder.addCase(sendVerificationSms.fulfilled, (state) => {
			state.errorMessage = '';
		});
		builder.addCase(sendVerificationSms.rejected, (state, action) => {
			state.errorMessage = action.payload || 'Failed to send SMS';
		});

		// News Feed cases
		builder.addCase(getNewsFeed.pending, (state) => {
			state.newsFeedLoading = true;
			state.newsFeedError = '';
		});
		builder.addCase(getNewsFeed.fulfilled, (state, action) => {
			state.newsFeedLoading = false;
			state.newsFeed = action.payload.feed;
			state.newsFeedCounts = action.payload.counts;
			state.newsFeedError = '';
		});
		builder.addCase(getNewsFeed.rejected, (state, action) => {
			state.newsFeedLoading = false;
			state.newsFeedError = action.payload || 'Failed to fetch news feed';
		});

		// Listen for deletions from other slices to update newsFeed
		builder.addCase(deleteEvent.fulfilled, (state, action) => {
			const deletedEventId = action.payload;
			state.newsFeed = state.newsFeed.filter(
				(item) => item.id !== deletedEventId
			);
			state.newsFeedCounts.events = Math.max(
				0,
				state.newsFeedCounts.events - 1
			);
			state.newsFeedCounts.total = Math.max(0, state.newsFeedCounts.total - 1);
		});

		builder.addCase(deletePrayerRequest.fulfilled, (state, action) => {
			const deletedPrayerRequestId = action.payload;
			state.newsFeed = state.newsFeed.filter(
				(item) => item.id !== deletedPrayerRequestId
			);
			state.newsFeedCounts.prayerRequests = Math.max(
				0,
				state.newsFeedCounts.prayerRequests - 1
			);
			state.newsFeedCounts.total = Math.max(0, state.newsFeedCounts.total - 1);
		});

		// ==================== FEED LIKES (events + prayer requests) ====================
		const updateFeedLike = (state, { id, type, liked, likeCount }) => {
			state.newsFeed = state.newsFeed.map((item) => {
				if (!item || item.id !== id) return item;
				if (type && item.type && item.type !== type) return item;

				const nextLikeCount = likeCount ?? item.likeCount ?? 0;

				return {
					...item,
					likedByUser: liked,
					likeCount: nextLikeCount,
				};
			});
		};

		builder.addCase(likeEvent.fulfilled, (state, action) => {
			updateFeedLike(state, {
				id: action.payload.eventId,
				type: 'event',
				liked: true,
				likeCount: action.payload.likeCount,
			});
		});

		builder.addCase(unlikeEvent.fulfilled, (state, action) => {
			updateFeedLike(state, {
				id: action.payload.eventId,
				type: 'event',
				liked: false,
				likeCount: action.payload.likeCount,
			});
		});

		builder.addCase(likePrayerRequest.fulfilled, (state, action) => {
			updateFeedLike(state, {
				id: action.payload.prayerRequestId,
				type: 'prayer_request',
				liked: true,
				likeCount: action.payload.likeCount,
			});
		});

		builder.addCase(unlikePrayerRequest.fulfilled, (state, action) => {
			updateFeedLike(state, {
				id: action.payload.prayerRequestId,
				type: 'prayer_request',
				liked: false,
				likeCount: action.payload.likeCount,
			});
		});

		// Fetch User Profile cases
		builder.addCase(fetchUserProfile.pending, (state) => {
			state.profileLoading = true;
			state.profileError = '';
		});
		builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
			state.profileLoading = false;
			state.profileError = '';
			// Update user info from profile response
			if (action.payload.user) {
				state.name = action.payload.user.full_name || state.name;
				state.username = action.payload.user.username || state.username;
				state.profilePicture =
					action.payload.user.profile_picture || state.profilePicture;
				state.dateOfBirth =
					action.payload.user.date_of_birth || state.dateOfBirth;
			}
			// Update activity summary
			if (action.payload.activitySummary) {
				state.activitySummary = action.payload.activitySummary;
			}
		});
		builder.addCase(fetchUserProfile.rejected, (state, action) => {
			state.profileLoading = false;
			state.profileError = action.payload || 'Failed to fetch profile';
		});

		// Upload Profile Picture cases
		builder.addCase(uploadProfilePicture.pending, (state) => {
			state.uploadingProfilePicture = true;
			state.profileError = '';
		});
		builder.addCase(uploadProfilePicture.fulfilled, (state, action) => {
			state.uploadingProfilePicture = false;
			state.profilePicture = action.payload.profilePictureUrl;
		});
		builder.addCase(uploadProfilePicture.rejected, (state, action) => {
			state.uploadingProfilePicture = false;
			state.profileError = action.payload || 'Failed to upload profile picture';
		});

		// Push token registration
		builder.addCase(registerPushToken.pending, (state) => {
			state.pushTokenError = '';
		});
		builder.addCase(registerPushToken.fulfilled, (state, action) => {
			state.pushTokenError = '';
			if (action.payload?.expoPushToken) {
				state.expoPushToken = action.payload.expoPushToken;
			}
		});
		builder.addCase(registerPushToken.rejected, (state, action) => {
			state.pushTokenError =
				action.payload || 'Failed to register push notifications';
		});
	},
});

// Export actions
export const { clearError, setErrorMessage, clearVerificationState } =
	userSlice.actions;

// Export reducer
export default userSlice.reducer;
