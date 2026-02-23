import { createSlice } from '@reduxjs/toolkit';
import {
	fetchSeries,
	fetchSeriesById,
	fetchSermonDetails,
	fetchSermonDiscussions,
	fetchSermons,
	fetchSermonsForSeries,
	updateSeries,
} from './sermonThunk';

const initialState = {
	sermons: [],
	sermonDetails: null,
	sermonDiscussions: [],
	series: [],
	current: [],
	upcoming: [],
	past: [],
	selectedSeries: null,
	loading: false,
	error: null,
	seriesUpdating: false,
	seriesUpdateError: null,
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
		clearSelectedSeries(state) {
			state.selectedSeries = null;
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
			})

			// Fetch series by ID
			.addCase(fetchSeriesById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSeriesById.fulfilled, (state, action) => {
				state.loading = false;
				state.selectedSeries = action.payload;
			})
			.addCase(fetchSeriesById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch sermons for a series
			.addCase(fetchSermonsForSeries.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSermonsForSeries.fulfilled, (state, action) => {
				state.loading = false;
				state.sermons = action.payload.sermons;
			})
			.addCase(fetchSermonsForSeries.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Update series
			.addCase(updateSeries.pending, (state) => {
				state.seriesUpdating = true;
				state.seriesUpdateError = null;
			})
			.addCase(updateSeries.fulfilled, (state, action) => {
				state.seriesUpdating = false;
				state.seriesUpdateError = null;
				const updated = action.payload;
				if (updated) {
					if (state.selectedSeries?.id === updated.id) {
						state.selectedSeries = { ...state.selectedSeries, ...updated };
					}
					const allSeries = [
						...state.current,
						...state.upcoming,
						...state.past,
					].map((s) => (s.id === updated.id ? { ...s, ...updated } : s));
					const categorized = categorizeSeries(allSeries);
					state.current = categorized.current;
					state.upcoming = categorized.upcoming;
					state.past = categorized.past;
				}
			})
			.addCase(updateSeries.rejected, (state, action) => {
				state.seriesUpdating = false;
				state.seriesUpdateError = action.payload;
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

export const { clearSelectedSeries } = sermonSlice.actions;
export default sermonSlice.reducer;
