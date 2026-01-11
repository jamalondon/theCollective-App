import { createAsyncThunk } from '@reduxjs/toolkit';
import ServerAPI from '../API/ServerAPI';

export const createPrayerRequest = createAsyncThunk(
	'prayerRequest/create',
	async ({ formData }, { rejectWithValue, getState }) => {
		const { user } = getState();
		const token = user.token;
		try {
			const response = await ServerAPI.post('/prayer-requests', formData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(
				'Create prayer request error:',
				error.response?.data || error.message
			);
			return rejectWithValue(
				error.response?.data?.error || 'Failed to create prayer request'
			);
		}
	}
);

export const getPrayerRequests = createAsyncThunk(
	'prayerRequest/get',
	async (_, { rejectWithValue }) => {
		try {
			const response = await ServerAPI.get('/prayer-requests');
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || 'Failed to fetch prayer requests'
			);
		}
	}
);

// Get specific prayer request by ID
export const getPrayerRequestById = createAsyncThunk(
	'prayerRequest/getById',
	async (prayerRequestId, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.get(
				`/prayer-requests/${prayerRequestId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || 'Failed to fetch prayer request'
			);
		}
	}
);

export const deletePrayerRequest = createAsyncThunk(
	'prayerRequest/delete',
	async (prayerRequestID, { rejectWithValue, getState }) => {
		const { user } = getState();
		const token = user.token;

		try {
			await ServerAPI.delete(`/prayer-requests/${prayerRequestID}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			return prayerRequestID; // Return the ID for reducers to remove from state
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || 'Failed to delete prayer request'
			);
		}
	}
);

// Get comments for a prayer request
export const getComments = createAsyncThunk(
	'prayerRequest/getComments',
	async (prayerRequestId, { rejectWithValue }) => {
		try {
			const response = await ServerAPI.get(
				`/prayer-requests/${prayerRequestId}/comments`
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || 'Failed to fetch comments'
			);
		}
	}
);

// Add a comment to a prayer request
export const addComment = createAsyncThunk(
	'prayerRequest/addComment',
	async ({ prayerRequestId, text }, { rejectWithValue, getState }) => {
		const { user } = getState();
		const token = user.token;

		try {
			const response = await ServerAPI.post(
				`/prayer-requests/${prayerRequestId}/comments`,
				{ text },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || 'Failed to add comment'
			);
		}
	}
);

// Delete a comment from a prayer request
export const deleteComment = createAsyncThunk(
	'prayerRequest/deleteComment',
	async ({ prayerRequestId, commentId }, { rejectWithValue, getState }) => {
		const { user } = getState();
		const token = user.token;

		try {
			await ServerAPI.delete(
				`/prayer-requests/${prayerRequestId}/comments/${commentId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return { commentId };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || 'Failed to delete comment'
			);
		}
	}
);

// Like a prayer request
export const likePrayerRequest = createAsyncThunk(
	'prayerRequest/like',
	async (prayerRequestId, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.post(
				`/prayer-requests/${prayerRequestId}/like`,
				null,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			return {
				prayerRequestId,
				liked: true,
				likeCount: response.data.likeCount,
			};
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error ||
					error.response?.data ||
					'Failed to like prayer request'
			);
		}
	}
);

// Unlike a prayer request
export const unlikePrayerRequest = createAsyncThunk(
	'prayerRequest/unlike',
	async (prayerRequestId, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.delete(
				`/prayer-requests/${prayerRequestId}/like`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			return {
				prayerRequestId,
				liked: false,
				likeCount: response.data.likeCount,
			};
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error ||
					error.response?.data ||
					'Failed to unlike prayer request'
			);
		}
	}
);
