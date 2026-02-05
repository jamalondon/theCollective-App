import { useSelector } from 'react-redux';
import { AppStyles, AuthStyles } from '../constants/styles';
import { selectTheme } from '../store/themeSlice';

/**
 * Custom hook to get themed styles
 * Automatically gets current theme colors and applies them to styles
 */
export const useThemedStyles = () => {
	const { colors } = useSelector(selectTheme);
	const authStyles = AuthStyles(colors);
	const appStyles = AppStyles(colors);
	return {
		AuthStyles: authStyles,
		AppStyles: appStyles,
		...authStyles,
		...appStyles,
	};
};

/**
 * Custom hook to get current theme
 * Returns colors, isDarkMode, and isSystemTheme
 */
export const useTheme = () => {
	return useSelector(selectTheme);
};
