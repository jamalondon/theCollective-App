import { useSelector } from 'react-redux';
import { AuthStyles } from '../constants/styles';
import { selectTheme } from '../store/themeSlice';

/**
 * Custom hook to get themed styles
 * Automatically gets current theme colors and applies them to styles
 */
export const useThemedStyles = () => {
	const { colors } = useSelector(selectTheme);
	const styles = AuthStyles(colors);
	return {
		AuthStyles: styles,
		...styles,
	};
};

/**
 * Custom hook to get current theme
 * Returns colors, isDarkMode, and isSystemTheme
 */
export const useTheme = () => {
	return useSelector(selectTheme);
};
