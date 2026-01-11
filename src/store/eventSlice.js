// src/store/eventsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
	addEventComment,
	attendEvent,
	cancelAttendance,
	createEvent,
	deleteEvent,
	deleteEventComment,
	getAllEvents,
	getAttendingEvents,
	getEventById,
	getEventComments,
	getMyEvents,
	likeEvent,
	populateDefaultLocations,
	searchGooglePlaces,
	searchLocations,
	searchUsers,
	unlikeEvent,
	updateEvent,
	updateEventComment,
} from './eventThunk';

const eventsSlice = createSlice({
	name: 'events',
	initialState: {
		allEvents: [], // All available events
		myEvents: [], // Events created by the current user
		attendingEvents: [], // Events the current user is attending
		featuredEvents: [], // Events to highlight on the home page
		selectedEvent: null, // Currently selected event for detailed view
		searchResults: [], // Results from user search
		locationSearchResults: [], // Results from location/Google Places search
		comments: [], // Comments for the currently selected event
		defaultLocations: [], // Default locations to load into the app
		commentsLoading: false, // Loading state for comments
		locationsLoading: false, // Loading state for locations
		locationSearchLoading: false, // Loading state for location search
		isLoading: false,
		error: null,
		filters: {
			category: 'all',
			dateRange: {
				start: null,
				end: null,
			},
			searchTerm: '',
			sortBy: 'date',
		},
	},
	reducers: {
		// Reset filters to default
		resetFilters: (state) => {
			state.filters = {
				category: 'all',
				dateRange: {
					start: null,
					end: null,
				},
				searchTerm: '',
				sortBy: 'date',
			};
		},
		//clear search results
		clearSearchResults: (state) => {
			state.searchResults = [];
		},
		// Clear location search results
		clearLocationSearchResults: (state) => {
			state.locationSearchResults = [];
		},
		// Select a specific event for detailed view
		selectEvent: (state, action) => {
			state.selectedEvent = action.payload;
		},
		// Clear selected event
		clearSelectedEvent: (state) => {
			state.selectedEvent = null;
			state.comments = [];
		},
		// Clear comments
		clearComments: (state) => {
			state.comments = [];
		},
	},
	extraReducers: (builder) => {
		// Get All Events
		builder.addCase(getAllEvents.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(getAllEvents.fulfilled, (state, action) => {
			state.isLoading = false;
			state.allEvents = action.payload;
			state.error = null;
		});
		builder.addCase(getAllEvents.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});

		// Get My Events
		builder.addCase(getMyEvents.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(getMyEvents.fulfilled, (state, action) => {
			state.isLoading = false;
			state.myEvents = action.payload;
			state.error = null;
		});
		builder.addCase(getMyEvents.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});

		// Get Attending Events
		builder.addCase(getAttendingEvents.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(getAttendingEvents.fulfilled, (state, action) => {
			state.isLoading = false;
			state.attendingEvents = action.payload;
			state.error = null;
		});
		builder.addCase(getAttendingEvents.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});

		// Create Event
		builder.addCase(createEvent.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(createEvent.fulfilled, (state, action) => {
			state.isLoading = false;
			state.allEvents.push(action.payload);
			state.myEvents.push(action.payload);
			state.error = null;
		});
		builder.addCase(createEvent.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});

		// Update Event
		builder.addCase(updateEvent.fulfilled, (state, action) => {
			const updatedEvent = action.payload;
			state.allEvents = state.allEvents.map((event) =>
				event.id === updatedEvent.id ? updatedEvent : event
			);
			state.myEvents = state.myEvents.map((event) =>
				event.id === updatedEvent.id ? updatedEvent : event
			);
			state.attendingEvents = state.attendingEvents.map((event) =>
				event.id === updatedEvent.id ? updatedEvent : event
			);
			if (state.selectedEvent?.id === updatedEvent.id) {
				state.selectedEvent = updatedEvent;
			}
		});

		// Delete Event
		builder.addCase(deleteEvent.fulfilled, (state, action) => {
			const deletedEventId = action.payload;
			state.allEvents = state.allEvents.filter(
				(event) => event.id !== deletedEventId
			);
			state.myEvents = state.myEvents.filter(
				(event) => event.id !== deletedEventId
			);
			state.attendingEvents = state.attendingEvents.filter(
				(event) => event.id !== deletedEventId
			);
			if (state.selectedEvent?.id === deletedEventId) {
				state.selectedEvent = null;
			}
		});

		builder.addCase(deleteEvent.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});

		// Get Event By ID
		builder.addCase(getEventById.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(getEventById.fulfilled, (state, action) => {
			state.isLoading = false;
			state.selectedEvent = action.payload;
			state.error = null;
		});
		builder.addCase(getEventById.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});

		// Attend Event
		builder.addCase(attendEvent.fulfilled, (state, action) => {
			const updatedEvent = action.payload;
			state.allEvents = state.allEvents.map((event) =>
				event.id === updatedEvent.id ? updatedEvent : event
			);
			if (
				!state.attendingEvents.find((event) => event.id === updatedEvent.id)
			) {
				state.attendingEvents.push(updatedEvent);
			}
			// Update selectedEvent if it matches
			if (state.selectedEvent?.id === updatedEvent.id) {
				state.selectedEvent = updatedEvent;
			}
		});

		// Cancel Attendance
		builder.addCase(cancelAttendance.fulfilled, (state, action) => {
			const updatedEvent = action.payload;
			state.allEvents = state.allEvents.map((event) =>
				event.id === updatedEvent.id ? updatedEvent : event
			);
			state.attendingEvents = state.attendingEvents.filter(
				(event) => event.id !== updatedEvent.id
			);
			// Update selectedEvent if it matches
			if (state.selectedEvent?.id === updatedEvent.id) {
				state.selectedEvent = updatedEvent;
			}
		});

		// ==================== EVENT LIKES ====================
		const applyEventLikeUpdate = (state, eventId, liked, likeCount) => {
			const patch = (evt) => {
				if (!evt || evt.id !== eventId) return evt;
				const nextLikeCount = likeCount ?? evt.likeCount ?? 0;
				return {
					...evt,
					likedByUser: liked,
					likeCount: nextLikeCount,
				};
			};

			state.allEvents = state.allEvents.map(patch);
			state.myEvents = state.myEvents.map(patch);
			state.attendingEvents = state.attendingEvents.map(patch);

			if (state.selectedEvent?.id === eventId) {
				state.selectedEvent = patch(state.selectedEvent);
			}
		};

		builder.addCase(likeEvent.fulfilled, (state, action) => {
			applyEventLikeUpdate(
				state,
				action.payload.eventId,
				true,
				action.payload.likeCount
			);
		});

		builder.addCase(unlikeEvent.fulfilled, (state, action) => {
			applyEventLikeUpdate(
				state,
				action.payload.eventId,
				false,
				action.payload.likeCount
			);
		});

		// Search Users to attend event
		builder.addCase(searchUsers.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(searchUsers.fulfilled, (state, action) => {
			state.isLoading = false;
			// Handle { data: [...] } response format from API
			state.searchResults = action.payload || [];
			state.error = null;
		});
		builder.addCase(searchUsers.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			state.searchResults = [];
		});

		// Search Locations
		builder.addCase(searchLocations.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(searchLocations.fulfilled, (state, action) => {
			state.isLoading = false;
			state.searchResults = action.payload;
			state.error = null;
		});
		builder.addCase(searchLocations.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			state.searchResults = [];
		});

		// Populate Default Locations
		builder.addCase(populateDefaultLocations.pending, (state) => {
			state.locationsLoading = true;
			state.error = null;
		});
		builder.addCase(populateDefaultLocations.fulfilled, (state, action) => {
			state.locationsLoading = false;
			state.defaultLocations = action.payload;
		});
		builder.addCase(populateDefaultLocations.rejected, (state, action) => {
			state.locationsLoading = false;
			state.error = action.payload;
		});

		// Search Google Places
		builder.addCase(searchGooglePlaces.pending, (state) => {
			console.log('searchGooglePlaces pending');
			state.locationSearchLoading = true;
			state.error = null;
		});
		builder.addCase(searchGooglePlaces.fulfilled, (state, action) => {
			console.log(
				'searchGooglePlaces fulfilled, action.payload:',
				action.payload
			);
			state.locationSearchLoading = false;
			state.locationSearchResults = action.payload;
			state.error = null;
		});
		builder.addCase(searchGooglePlaces.rejected, (state, action) => {
			console.log('searchGooglePlaces rejected, error:', action.payload);
			state.locationSearchLoading = false;
			state.error = action.payload;
			state.locationSearchResults = [];
		});

		// ==================== EVENT COMMENTS ====================

		// Get Event Comments
		builder.addCase(getEventComments.pending, (state) => {
			state.commentsLoading = true;
			state.error = null;
		});
		builder.addCase(getEventComments.fulfilled, (state, action) => {
			state.commentsLoading = false;
			state.comments = action.payload.comments || [];
			state.error = null;
		});
		builder.addCase(getEventComments.rejected, (state, action) => {
			state.commentsLoading = false;
			state.error = action.payload;
			state.comments = [];
		});

		// Add Event Comment
		builder.addCase(addEventComment.pending, (state) => {
			state.commentsLoading = true;
			state.error = null;
		});
		builder.addCase(addEventComment.fulfilled, (state, action) => {
			state.commentsLoading = false;
			state.comments.push(action.payload.comment);
			state.error = null;
		});
		builder.addCase(addEventComment.rejected, (state, action) => {
			state.commentsLoading = false;
			state.error = action.payload;
		});

		// Update Event Comment
		builder.addCase(updateEventComment.pending, (state) => {
			state.commentsLoading = true;
			state.error = null;
		});
		builder.addCase(updateEventComment.fulfilled, (state, action) => {
			state.commentsLoading = false;
			const updatedComment = action.payload.comment;
			state.comments = state.comments.map((comment) =>
				comment.id === updatedComment.id ? updatedComment : comment
			);
			state.error = null;
		});
		builder.addCase(updateEventComment.rejected, (state, action) => {
			state.commentsLoading = false;
			state.error = action.payload;
		});

		// Delete Event Comment
		builder.addCase(deleteEventComment.pending, (state) => {
			state.commentsLoading = true;
			state.error = null;
		});
		builder.addCase(deleteEventComment.fulfilled, (state, action) => {
			state.commentsLoading = false;
			const { commentId } = action.payload;
			state.comments = state.comments.filter(
				(comment) => comment.id !== commentId
			);
			state.error = null;
		});
		builder.addCase(deleteEventComment.rejected, (state, action) => {
			state.commentsLoading = false;
			state.error = action.payload;
		});
	},
});

// Export actions
export const {
	resetFilters,
	selectEvent,
	clearSelectedEvent,
	clearSearchResults,
	clearLocationSearchResults,
	clearComments,
} = eventsSlice.actions;

// Export reducer
export default eventsSlice.reducer;
