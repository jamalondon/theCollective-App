import { Dimensions } from 'react-native';

export const LIGHT_COLORS = {
	primary: 'red',
	background: 'rgba(225, 225, 225, 255)',
	surface: 'rgb(240,240,240)',
	text: {
		primary: 'rgba(0, 0, 0, 1)',
		secondary: '#868e96',
		light: '#999999',
		button: '#ffffff',
	},
	border: {
		default: '#E5E5E5',
		disabled: '#ccc',
		light: '#f1f3f5',
		input: '#e9ecef',
	},
	shadow: 'rgba(0, 0, 0, 1)',
	card: '#ffffff',
	error: 'red',
	success: '#28a745',
	warning: '#ffc107',
	postTypes: {
		event: {
			// Neutral palette (no blue)
			accent: '#94A3B8',
			background: '#F8FAFC',
			tag: '#EEF2F6',
			tagText: '#334155',
		},
		prayerRequest: {
			// Neutral palette (no purple)
			accent: '#A1A1AA',
			background: '#F8FAFC',
			tag: '#F1F5F9',
			tagText: '#475569',
		},
		comment: {
			accent: '#FF9800',
			background: '#FFF8E1',
			tag: '#FFF3C4',
			tagText: '#E65100',
		},
		default: {
			accent: '#757575',
			background: '#FAFAFA',
			tag: '#F5F5F5',
			tagText: '#424242',
		},
	},
};

export const DARK_COLORS = {
	primary: 'rgb(255, 107, 107)',
	background: 'rgba(0, 0, 0, 1)',
	surface: 'rgb(30, 30, 30)',
	text: {
		primary: 'rgb(255, 255, 255)',
		secondary: '#B0B0B0',
		dark: 'rgba(0, 0, 0, 1)',
		button: '#ffffff',
	},
	border: {
		default: '#2D2D2D',
		light: '#3D3D3D',
		input: '#2D2D2D',
	},
	shadow: 'rgba(255, 255, 255, 1)',
	card: '#1E1E1E',
	error: 'red',
	success: '#4caf50',
	warning: '#ff9800',
	postTypes: {
		event: {
			// Neutral palette (no blue)
			accent: '#64748B',
			background: '#0B0F14',
			tag: '#1F2937',
			tagText: '#E5E7EB',
		},
		prayerRequest: {
			// Neutral palette (no purple)
			accent: '#71717A',
			background: '#0B0F14',
			tag: '#111827',
			tagText: '#E5E7EB',
		},
		comment: {
			accent: '#FFB74D',
			background: '#2E2419',
			tag: '#3E3429',
			tagText: '#FFCC80',
		},
		default: {
			accent: '#9E9E9E',
			background: '#2A2A2A',
			tag: '#3A3A3A',
			tagText: '#BDBDBD',
		},
	},
};

export const DIMENSIONS = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height,
};

export const SPACING = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	xxl: 24,
	xxxl: 32,
};

export const FONTS = {
	sizes: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 24,
		xxl: 28,
	},
	weights: {
		regular: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
	},
};
