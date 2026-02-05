import { createSlice } from '@reduxjs/toolkit';
import {
	fetchSeries,
	fetchSermonDetails,
	fetchSermonDiscussions,
	fetchSermons,
} from './sermonThunk';

const initialState = {
	sermons: [],
	sermonDetails: null,
	sermonDiscussions: [],
	series: [],
	current: [],
	upcoming: [],
	past: [],
	loading: false,
	error: null,
};

const sermonSlice = createSlice({
	name: 'sermons',
	initialState,
	reducers: {
		setSermons(state, action) {
			state.sermons = action.payload;
		},
		setSermonDetails(state, action) {
			state.sermonDetails = action.payload;
		},
		setSermonDiscussions(state, action) {
			state.sermonDiscussions = action.payload;
		},
		setSeries(state, action) {
			state.series = action.payload;
		},
		setCurrentSeries(state, action) {
			state.current = action.payload;
		},
		setUpcomingSeries(state, action) {
			state.upcoming = action.payload;
		},
		setPastSeries(state, action) {
			state.past = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch all sermons
			.addCase(fetchSermons.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSermons.fulfilled, (state, action) => {
				state.loading = false;
				state.sermons.push(action.payload);
			})
			.addCase(fetchSermons.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch sermon details
			.addCase(fetchSermonDetails.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSermonDetails.fulfilled, (state, action) => {
				state.loading = false;
				state.sermonDetails = action.payload;
			})
			.addCase(fetchSermonDetails.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch sermon discussions
			.addCase(fetchSermonDiscussions.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSermonDiscussions.fulfilled, (state, action) => {
				state.loading = false;
				state.sermonDiscussions = action.payload;
			})
			.addCase(fetchSermonDiscussions.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch series
			.addCase(fetchSeries.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSeries.fulfilled, (state, action) => {
				state.loading = false;
				const categorized = categorizeSeries(action.payload);
				state.current = categorized.current;
				state.upcoming = categorized.upcoming;
				state.past = categorized.past;
			})
			.addCase(fetchSeries.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

const categorizeSeries = (series) => {
	const now = new Date();
	const current = [];
	const upcoming = [];
	const past = [];

	series.forEach((s) => {
		const startDate = new Date(s.start_date);
		const endDate = new Date(s.end_date);

		if (startDate <= now && endDate >= now) {
			current.push(s);
		} else if (startDate > now) {
			upcoming.push(s);
		} else {
			past.push(s);
		}
	});

	return { current, upcoming, past };
};

export default sermonSlice.reducer;
