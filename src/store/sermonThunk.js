import { createAsyncThunk } from '@reduxjs/toolkit';
import ServerAPI from '../API/ServerAPI';

// Fetch all sermons
export const fetchSermons = createAsyncThunk(
	'sermons/fetchSermons',
	async (_, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token;
			const response = await ServerAPI.get('/sermons', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Fetch sermon details by ID
export const fetchSermonDetails = createAsyncThunk(
	'sermons/fetchSermonDetails',
	async (sermonId, { rejectWithValue }) => {
		try {
			const response = await ServerAPI.get(`/sermons/${sermonId}`);
			return response.data.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Fetch discussions for a sermon
export const fetchSermonDiscussions = createAsyncThunk(
	'sermons/fetchSermonDiscussions',
	async (sermonId, { rejectWithValue }) => {
		try {
			const response = await ServerAPI.get(`/sermon-discussions/${sermonId}`);
			return response.data.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Fetch all sermon series
export const fetchSeries = createAsyncThunk(
	'sermons/fetchSeries',
	async (_, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token; // Get token from Redux store
			const response = await ServerAPI.get('/sermon-series', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data.data;
		} catch (error) {
			console.error(
				'Error fetching series:',
				error.response?.data || error.message,
			); // Log error
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Fetch sermon series by ID
export const fetchSeriesById = createAsyncThunk(
	'sermons/fetchSeriesById',
	async (seriesId, { rejectWithValue }) => {
		try {
			const response = await ServerAPI.get(`/sermon-series/${seriesId}`);
			return response.data.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Create sermon series
export const createSeries = createAsyncThunk(
	'sermons/createSeries',
	async (seriesData, { rejectWithValue }) => {
		try {
			const response = await ServerAPI.post('/sermon-series', seriesData);
			return response.data.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Update sermon series
export const updateSeries = createAsyncThunk(
	'sermons/updateSeries',
	async ({ seriesId, updateData }, { rejectWithValue }) => {
		try {
			const response = await ServerAPI.patch(
				`/sermon-series/${seriesId}`,
				updateData,
			);
			return response.data.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Delete sermon series
export const deleteSeries = createAsyncThunk(
	'sermons/deleteSeries',
	async (seriesId, { rejectWithValue }) => {
		try {
			await ServerAPI.delete(`/sermon-series/${seriesId}`);
			return seriesId;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);
