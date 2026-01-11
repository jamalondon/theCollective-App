import { createSelector, createSlice } from '@reduxjs/toolkit';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

const initialState = {
	isDarkMode: false,
	isSystemTheme: true,
	colors: LIGHT_COLORS,
};

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		toggleTheme: (state) => {
			state.isSystemTheme = false;
			state.isDarkMode = !state.isDarkMode;
			state.colors = state.isDarkMode ? DARK_COLORS : LIGHT_COLORS;
		},
		setTheme: (state, action) => {
			state.isSystemTheme = false;
			state.isDarkMode = action.payload;
			state.colors = action.payload ? DARK_COLORS : LIGHT_COLORS;
		},
		setSystemTheme: (state, action) => {
			state.isSystemTheme = true;
			state.isDarkMode = action.payload;
			state.colors = action.payload ? DARK_COLORS : LIGHT_COLORS;
		},
	},
});

export const { toggleTheme, setTheme, setSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;

// Memoized selectors
const selectThemeState = (state) => state.theme;

export const selectTheme = createSelector([selectThemeState], (theme) => ({
	isDarkMode: theme.isDarkMode,
	isSystemTheme: theme.isSystemTheme,
	colors: theme.colors,
}));
