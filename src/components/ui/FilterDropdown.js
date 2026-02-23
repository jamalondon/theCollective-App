import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useRef, useState } from 'react';
import {
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, SPACING } from '../../constants/theme';
import { useTheme } from '../../hooks/useThemedStyles';
import { pressableOpacityStyle } from '../../utils/pressableOpacityStyle';

export default function FilterDropdown({ value, onValueChange, options }) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [buttonLayout, setButtonLayout] = useState(null);
	const buttonRef = useRef(null);
	const isDarkMode = useSelector((state) => state.theme.isDarkMode);
	const { colors } = useTheme();

	const selectedOption = options.find((opt) => opt.value === value);

	const handleSelectOption = (optionValue) => {
		onValueChange(optionValue);
		setDropdownOpen(false);
	};

	const handleOpenDropdown = () => {
		if (buttonRef.current) {
			buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
				setButtonLayout({ x: pageX, y: pageY, width, height });
				setDropdownOpen(true);
			});
		}
	};

	return (
		<>
			<Pressable
				ref={buttonRef}
				onPress={handleOpenDropdown}
				style={pressableOpacityStyle({
					style: [styles.dropdownButton, { backgroundColor: colors.card }],
					activeOpacity: 0.7,
				})}
			>
				<Text
					style={[styles.dropdownButtonText, { color: colors.text.primary }]}
				>
					{selectedOption?.label || 'Select'}
				</Text>
				<MaterialIcons
					name={dropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
					size={24}
					color={colors.text.primary}
				/>
			</Pressable>

			<Modal
				visible={dropdownOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setDropdownOpen(false)}
			>
				<Pressable
					onPress={() => setDropdownOpen(false)}
					style={pressableOpacityStyle({
						style: styles.modalOverlay,
						activeOpacity: 1,
					})}
				>
					{buttonLayout && (
						<View
							style={[
								styles.dropdownMenuContainer,
								{
									top: buttonLayout.y + buttonLayout.height + SPACING.sm,
									left: buttonLayout.x - (200 - buttonLayout.width) / 2,
								},
							]}
						>
							<BlurView
								intensity={isDarkMode ? 80 : 60}
								tint={isDarkMode ? 'dark' : 'light'}
								style={[
									styles.dropdownMenu,
									{
										backgroundColor: isDarkMode
											? 'rgba(30, 30, 30, 0.85)'
											: 'rgba(255, 255, 255, 0.85)',
										borderColor: isDarkMode
											? 'rgba(255, 255, 255, 0.1)'
											: 'rgba(0, 0, 0, 0.08)',
									},
								]}
							>
								{options.map((option, index) => (
									<React.Fragment key={option.value}>
										{index > 0 && (
											<View
												style={[
													styles.menuDivider,
													{
														backgroundColor: isDarkMode
															? 'rgba(255, 255, 255, 0.08)'
															: 'rgba(0, 0, 0, 0.06)',
													},
												]}
											/>
										)}
										<Pressable
											onPress={() => handleSelectOption(option.value)}
											style={pressableOpacityStyle({
												style: styles.menuItem,
												activeOpacity: 0.6,
											})}
										>
											<Text
												style={[
													styles.menuItemText,
													{ color: colors.text.primary },
													value === option.value && {
														color: colors.primary,
														fontWeight: FONTS.weights.semibold,
													},
												]}
											>
												{option.label}
											</Text>
											{value === option.value && (
												<MaterialIcons
													name="check"
													size={20}
													color={colors.primary}
												/>
											)}
										</Pressable>
									</React.Fragment>
								))}
							</BlurView>
						</View>
					)}
				</Pressable>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	dropdownButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
		borderRadius: 16,
		paddingHorizontal: SPACING.lg,
		paddingVertical: SPACING.md,
		minWidth: 160,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.12,
				shadowRadius: 8,
			},
			android: {
				elevation: 4,
			},
		}),
	},
	dropdownButtonText: {
		fontSize: FONTS.sizes.md,
		fontWeight: FONTS.weights.semibold,
		marginRight: SPACING.xs,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	dropdownMenuContainer: {
		position: 'absolute',
		width: 200,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 12 },
				shadowOpacity: 0.25,
				shadowRadius: 24,
			},
			android: {
				elevation: 12,
			},
		}),
	},
	dropdownMenu: {
		borderWidth: 1,
		borderRadius: 20,
		overflow: 'hidden',
		backdropFilter: 'blur(40px)',
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: SPACING.lg,
		paddingVertical: SPACING.lg,
	},
	menuItemText: {
		fontSize: FONTS.sizes.md,
		fontWeight: FONTS.weights.medium,
	},
	menuDivider: {
		height: 1,
	},
});
