import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './eventSlice';
import notificationPreferencesReducer from './notificationPreferencesSlice';
import prayerRequestsReducer from './prayerRequestSlice';
import themeReducer from './themeSlice';
import userReducer from './userSlice';

// You can add more reducers here as your app grows
const store = configureStore({
	reducer: {
		user: userReducer,
		events: eventsReducer,
		notificationPreferences: notificationPreferencesReducer,
		theme: themeReducer,
		prayerRequests: prayerRequestsReducer,
	},
	// Optional middleware configuration if needed
	// middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
