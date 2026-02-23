import { createAsyncThunk } from '@reduxjs/toolkit';
import ServerAPI from '../API/ServerAPI';

export const fetchUserPreferences = createAsyncThunk(
	'user/fetchPreferences',
	async (_, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token;
			if (!token) return rejectWithValue('No authentication token');

			const response = await ServerAPI.get('/users/preferences', {
				headers: { Authorization: `Bearer ${token}` },
			});

			return response.data.data.preferences;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					'Failed to fetch preferences',
			);
		}
	},
);

export const updateUserPreferences = createAsyncThunk(
	'user/updatePreferences',
	async (partialUpdate, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token;
			if (!token) return rejectWithValue('No authentication token');

			const response = await ServerAPI.put(
				'/users/preferences',
				partialUpdate,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);

			return response.data.data.preferences;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					'Failed to update preferences',
			);
		}
	},
);
