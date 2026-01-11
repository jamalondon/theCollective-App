import axios from 'axios';
export default axios.create({
	baseURL: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API,
	timeout: 10000, // 10 second timeout
});
