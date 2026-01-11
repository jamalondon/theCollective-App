import { createSlice } from '@reduxjs/toolkit';
import {
	fetchNotificationPreferences,
	resetNotificationPreferences,
	updateNotificationPreferences,
} from './notificationPreferencesThunk';
import { signOutUser } from './userThunk';

const initialState = {
	loading: false,
	saving: false,
	error: '',
	preferences: {
		notifications_enabled: null,
		event_notifications: null,
		prayer_notifications: null,
		social_notifications: null,
		updated_at: null,
	},
};

const notificationPreferencesSlice = createSlice({
	name: 'notificationPreferences',
	initialState,
	reducers: {
		clearNotificationPreferencesError: (state) => {
			state.error = '';
		},
	},
	extraReducers: (builder) => {
		// Fetch
		builder.addCase(fetchNotificationPreferences.pending, (state) => {
			state.loading = true;
			state.error = '';
		});
		builder.addCase(fetchNotificationPreferences.fulfilled, (state, action) => {
			state.loading = false;
			state.error = '';
			if (action.payload) {
				state.preferences = action.payload;
			}
		});
		builder.addCase(fetchNotificationPreferences.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload || 'Failed to fetch notification preferences';
		});

		// Update
		builder.addCase(updateNotificationPreferences.pending, (state) => {
			state.saving = true;
			state.error = '';
		});
		builder.addCase(updateNotificationPreferences.fulfilled, (state, action) => {
			state.saving = false;
			state.error = '';
			if (action.payload) {
				state.preferences = action.payload;
			}
		});
		builder.addCase(updateNotificationPreferences.rejected, (state, action) => {
			state.saving = false;
			state.error = action.payload || 'Failed to update notification preferences';
		});

		// Reset
		builder.addCase(resetNotificationPreferences.pending, (state) => {
			state.saving = true;
			state.error = '';
		});
		builder.addCase(resetNotificationPreferences.fulfilled, (state, action) => {
			state.saving = false;
			state.error = '';
			if (action.payload) {
				state.preferences = action.payload;
			}
		});
		builder.addCase(resetNotificationPreferences.rejected, (state, action) => {
			state.saving = false;
			state.error = action.payload || 'Failed to reset notification preferences';
		});

		// Sign out should clear server-backed prefs (no cross-user bleed)
		builder.addCase(signOutUser.fulfilled, () => initialState);
	},
});

export const { clearNotificationPreferencesError } =
	notificationPreferencesSlice.actions;

export default notificationPreferencesSlice.reducer;


