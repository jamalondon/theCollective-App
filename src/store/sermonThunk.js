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
	async (sermonId, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token;
			const response = await ServerAPI.get(`/sermons/${sermonId}`, {
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

// Fetch discussions for a sermon
export const fetchSermonDiscussions = createAsyncThunk(
	'sermons/fetchSermonDiscussions',
	async (sermonId, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token;
			const response = await ServerAPI.get(
				`/sermon-discussions/${sermonId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
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
			const token = getState().user.token;
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
			);
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Fetch sermon series by ID
export const fetchSeriesById = createAsyncThunk(
	'sermons/fetchSeriesById',
	async (seriesId, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token;
			const response = await ServerAPI.get(
				`/sermon-series/${seriesId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			return response.data.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Create sermon series
export const createSeries = createAsyncThunk(
	'sermons/createSeries',
	async (seriesData, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token;
			const response = await ServerAPI.post(
				'/sermon-series',
				seriesData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			return response.data.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Update sermon series
export const updateSeries = createAsyncThunk(
	'sermons/updateSeries',
	async ({ seriesId, updateData, coverImageUri }, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token;
			const headers = { Authorization: `Bearer ${token}` };

			let body = updateData;

			if (coverImageUri) {
				const formData = new FormData();
				Object.keys(updateData).forEach((key) => {
					formData.append(key, updateData[key]);
				});
				const filename = coverImageUri.split('/').pop();
				const match = /\.(\w+)$/.exec(filename);
				const type = match ? `image/${match[1]}` : 'image/jpeg';
				formData.append('coverImage', {
					uri: coverImageUri,
					name: filename,
					type,
				});
				body = formData;
				headers['Content-Type'] = 'multipart/form-data';
			}

			const response = await ServerAPI.patch(
				`/sermon-series/${seriesId}`,
				body,
				{ headers },
			);
			return response.data.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Fetch full sermon details for all sermons in a series
export const fetchSermonsForSeries = createAsyncThunk(
	'sermons/fetchSermonsForSeries',
	async ({ seriesId, sermonIds }, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token;
			const headers = { Authorization: `Bearer ${token}` };
			const sermons = await Promise.all(
				sermonIds.map((id) =>
					ServerAPI.get(`/sermons/${id}`, { headers }).then(
						(res) => res.data.data,
					),
				),
			);
			return { seriesId, sermons };
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);

// Delete sermon series
export const deleteSeries = createAsyncThunk(
	'sermons/deleteSeries',
	async (seriesId, { rejectWithValue, getState }) => {
		try {
			const token = getState().user.token;
			await ServerAPI.delete(`/sermon-series/${seriesId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return seriesId;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	},
);
