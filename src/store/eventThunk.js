import { createAsyncThunk } from '@reduxjs/toolkit';
import GoogleAPI from '../API/GoogleAPI';
import ServerAPI from '../API/ServerAPI';
//import * as RootNavigation from '../navigation/navigationRef';

// Create a new event
export const createEvent = createAsyncThunk(
	'events/create',
	async (eventData, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.post('/events/create', eventData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Failed to create event');
		}
	}
);

// Get all events
export const getAllEvents = createAsyncThunk(
	'events/getAll',
	async (_, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.get('/events', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Failed to fetch events');
		}
	}
);

// Get events owned by current user
export const getMyEvents = createAsyncThunk(
	'events/getMine',
	async (_, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.get('/events/my-events', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Failed to fetch your events'
			);
		}
	}
);

// Get events user is attending
export const getAttendingEvents = createAsyncThunk(
	'events/getAttending',
	async (_, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.get('/events/attending', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Failed to fetch attending events'
			);
		}
	}
);

// Get specific event by ID
export const getEventById = createAsyncThunk(
	'events/getById',
	async (eventId, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.get(`/events/${eventId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Failed to fetch event');
		}
	}
);

// Update an event
export const updateEvent = createAsyncThunk(
	'events/update',
	async ({ eventId, updateData }, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.put(
				`/events/${eventId}/update`,
				updateData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Failed to update event');
		}
	}
);

// Attend an event
export const attendEvent = createAsyncThunk(
	'events/attend',
	async (eventId, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.post(`/events/${eventId}/attend`, null, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Failed to attend event');
		}
	}
);

// Cancel attendance
export const cancelAttendance = createAsyncThunk(
	'events/cancel',
	async (eventId, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.post(`/events/${eventId}/cancel`, null, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Failed to cancel attendance'
			);
		}
	}
);

// Like an event
export const likeEvent = createAsyncThunk(
	'events/like',
	async (eventId, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.post(`/events/${eventId}/like`, null, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return {
				eventId,
				liked: true,
				likeCount: response.data?.likeCount ?? null,
			};
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Failed to like event');
		}
	}
);

// Unlike an event
export const unlikeEvent = createAsyncThunk(
	'events/unlike',
	async (eventId, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.delete(`/events/${eventId}/like`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return {
				eventId,
				liked: false,
				likeCount: response.data?.likeCount ?? null,
			};
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Failed to unlike event');
		}
	}
);

// Delete an event
export const deleteEvent = createAsyncThunk(
	'events/delete',
	async (eventId, { rejectWithValue, getState }) => {
		console.log('deleteEvent', eventId);
		try {
			const { user } = getState();
			const token = user.token;
			await ServerAPI.delete(`/events/${eventId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return eventId; // Return the ID for the reducer to remove from state
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Failed to delete event');
		}
	}
);

// Search users
export const searchUsers = createAsyncThunk(
	'events/searchUsers',
	async (searchQuery, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.get(
				`/users/search?query=${encodeURIComponent(searchQuery)}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const currentUserID = user.userID;
			//before returning the response, filter out the current user
			const filteredUsers = response.data.data.filter(
				(user) => user.id !== currentUserID
			);
			return filteredUsers;
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Failed to search users');
		}
	}
);

// Search locations
export const searchLocations = createAsyncThunk(
	'events/searchLocations',
	async (searchQuery, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.get(
				`/locations/search?query=${encodeURIComponent(searchQuery)}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Failed to search locations'
			);
		}
	}
);

// Populate default locations
export const populateDefaultLocations = createAsyncThunk(
	'events/populateDefaultLocations',
	async (_, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.get('events/locations', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Failed to populate default locations'
			);
		}
	}
);

// Search Google Places API
export const searchGooglePlaces = createAsyncThunk(
	'events/searchGooglePlaces',
	async (searchQuery, { rejectWithValue }) => {
		try {
			const response = await GoogleAPI.post(
				'/places:searchText',
				{ textQuery: searchQuery },
				{
					headers: {
						'Content-Type': 'application/json',
						'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
						'X-Goog-FieldMask':
							'places.displayName,places.formattedAddress,places.priceLevel',
					},
				}
			);
			// Transform Google Places response to match our location format
			const places = response.data.places || [];
			return places.map((place) => ({
				id: `google-${place.formattedAddress}`,
				name: place.displayName?.text || '',
				address: place.formattedAddress || '',
				latitude: place.location?.latitude || null,
				longitude: place.location?.longitude || null,
				isGooglePlace: true,
			}));
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Failed to search Google Places'
			);
		}
	}
);

// ==================== EVENT COMMENTS ====================

// Add a comment to an event
export const addEventComment = createAsyncThunk(
	'events/addComment',
	async ({ eventId, text }, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.post(
				`/events/${eventId}/comments`,
				{ text },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Failed to add comment');
		}
	}
);

// Get all comments for an event
export const getEventComments = createAsyncThunk(
	'events/getComments',
	async (eventId, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.get(`/events/${eventId}/comments`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Failed to fetch comments'
			);
		}
	}
);

// Update a comment
export const updateEventComment = createAsyncThunk(
	'events/updateComment',
	async ({ eventId, commentId, text }, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			const response = await ServerAPI.put(
				`/events/${eventId}/comments/${commentId}`,
				{ text },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Failed to update comment'
			);
		}
	}
);

// Delete a comment
export const deleteEventComment = createAsyncThunk(
	'events/deleteComment',
	async ({ eventId, commentId }, { rejectWithValue, getState }) => {
		try {
			const { user } = getState();
			const token = user.token;
			await ServerAPI.delete(`/events/${eventId}/comments/${commentId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return { eventId, commentId };
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Failed to delete comment'
			);
		}
	}
);
