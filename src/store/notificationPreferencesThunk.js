import { createAsyncThunk } from '@reduxjs/toolkit';
import ServerAPI from '../API/ServerAPI';

const ALLOWED_BOOLEAN_KEYS = new Set([
	'notifications_enabled',
	'event_notifications',
	'prayer_notifications',
	'social_notifications',
]);

function pickBooleanUpdates(partial) {
	if (!partial || typeof partial !== 'object') return {};

	const update = {};
	for (const [key, value] of Object.entries(partial)) {
		if (!ALLOWED_BOOLEAN_KEYS.has(key)) continue;
		if (typeof value !== 'boolean') continue;
		update[key] = value;
	}
	return update;
}

export const fetchNotificationPreferences = createAsyncThunk(
	'notificationPreferences/fetch',
	async (_, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;

			const response = await ServerAPI.get('/notifications/preferences', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const preferences = response.data?.data?.preferences;
			if (!preferences) {
				return rejectWithValue('Invalid server response (missing preferences)');
			}
			return preferences;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || 'Failed to fetch notification preferences'
			);
		}
	}
);

export const updateNotificationPreferences = createAsyncThunk(
	'notificationPreferences/update',
	async (partialUpdate, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;

			const update = pickBooleanUpdates(partialUpdate);
			if (Object.keys(update).length === 0) {
				return rejectWithValue('No valid boolean preference fields provided');
			}

			const response = await ServerAPI.put('/notifications/preferences', update, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const preferences = response.data?.data?.preferences;
			if (!preferences) {
				return rejectWithValue('Invalid server response (missing preferences)');
			}
			return preferences;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || 'Failed to update notification preferences'
			);
		}
	}
);

export const resetNotificationPreferences = createAsyncThunk(
	'notificationPreferences/reset',
	async (_, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;

			const response = await ServerAPI.post(
				'/notifications/preferences/reset',
				null,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const preferences = response.data?.data?.preferences;
			if (!preferences) {
				return rejectWithValue('Invalid server response (missing preferences)');
			}
			return preferences;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || 'Failed to reset notification preferences'
			);
		}
	}
);


