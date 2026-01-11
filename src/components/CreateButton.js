import { usePathname, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
	Animated,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import Icon from './Icon';
import { pressableOpacityStyle } from '../utils/pressableOpacityStyle';

const { EntypoIcon, MaterialIcons } = Icon;

export default function CreateButton({ tabBarHeight = 75 }) {
	const [isOpen, setIsOpen] = useState(false);
	const animation = useRef(new Animated.Value(0)).current;
	const router = useRouter();
	const pathname = usePathname();

	// Hide button on create screens
	if (
		pathname?.includes('/create') ||
		pathname?.includes('/createEvent') ||
		pathname?.includes('/createPrayerRequest')
	) {
		return null;
	}

	// Dynamic bottom positioning based on tab bar height
	const bottomPosition = tabBarHeight + 15;

	const toggleMenu = () => {
		const toValue = isOpen ? 0 : 1;

		Animated.spring(animation, {
			toValue,
			friction: 7,
			tension: 40,
			useNativeDriver: true,
		}).start();

		setIsOpen(!isOpen);
	};

	const handleEventPress = () => {
		toggleMenu();
		setTimeout(() => {
			router.push('/createEvent');
		}, 200);
	};

	const handlePrayerPress = () => {
		toggleMenu();
		setTimeout(() => {
			router.push('/createPrayerRequest');
		}, 200);
	};

	const prayerButtonStyle = {
		transform: [
			{ scale: animation },
			{
				translateY: animation.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -120],
				}),
			},
		],
		opacity: animation,
	};

	const eventButtonStyle = {
		transform: [
			{ scale: animation },
			{
				translateY: animation.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -60],
				}),
			},
		],
		opacity: animation,
	};

	return (
		<>
			{/* Overlay to close menu when clicking outside */}
			{isOpen && (
				<Pressable
					onPress={toggleMenu}
					style={pressableOpacityStyle({
						style: styles.overlay,
						activeOpacity: 1,
					})}
				/>
			)}

			<View style={[styles.container, { bottom: bottomPosition }]}>
				{/* Prayer Request Button */}
				<Animated.View style={[styles.actionButton, prayerButtonStyle]}>
					<Pressable
						onPress={handlePrayerPress}
						style={pressableOpacityStyle({
							style: styles.actionButtonTouchable,
							activeOpacity: 0.9,
						})}
					>
						<MaterialIcons name="favorite" color="#fff" size={22} />
						<Text style={styles.actionButtonText}>Prayer</Text>
					</Pressable>
				</Animated.View>

				{/* Event Button */}
				<Animated.View style={[styles.actionButton, eventButtonStyle]}>
					<Pressable
						onPress={handleEventPress}
						style={pressableOpacityStyle({
							style: styles.actionButtonTouchable,
							activeOpacity: 0.9,
						})}
					>
						<EntypoIcon name="calendar" color="#fff" size={22} />
						<Text style={styles.actionButtonText}>Event</Text>
					</Pressable>
				</Animated.View>

				{/* Main FAB Button */}
				<Pressable
					onPress={toggleMenu}
					style={pressableOpacityStyle({
						style: styles.fabButton,
						activeOpacity: 0.9,
					})}
				>
					{isOpen ? (
						<EntypoIcon name="cross" color="#fff" size={28} />
					) : (
						<EntypoIcon name="plus" color="#fff" size={28} />
					)}
				</Pressable>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		right: 20,
		alignItems: 'flex-end',
		zIndex: 1000,
	},
	fabButton: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#FF7A7A',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 8,
	},
	actionButton: {
		position: 'absolute',
		bottom: 0,
		right: 0,
	},
	actionButtonTouchable: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FF7A7A',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 28,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
		minWidth: 160,
	},
	actionButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 10,
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		zIndex: 999,
	},
});
