import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { FONTS, SPACING } from '../../constants/theme';
import { useTheme } from '../../hooks/useThemedStyles';
import { pressableOpacityStyle } from '../../utils/pressableOpacityStyle';

export default function FilterDropdown({ value, onValueChange, options }) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const insets = useSafeAreaInsets();
	const isDarkMode = useSelector((state) => state.theme.isDarkMode);
	const { colors } = useTheme();

	const selectedOption = options.find((opt) => opt.value === value);

	const handleSelectOption = (optionValue) => {
		onValueChange(optionValue);
		setDropdownOpen(false);
	};

	return (
		<>
			<Pressable
				onPress={() => setDropdownOpen(true)}
				style={pressableOpacityStyle({
					style: styles.dropdownButton,
					activeOpacity: 0.7,
				})}
			>
				<Text style={styles.dropdownButtonText}>
					{selectedOption?.label || 'Select'}
				</Text>
				<MaterialIcons
					name={dropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
					size={24}
					color={'black'}
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
					<View
						style={[
							styles.dropdownMenu,
							{
								top: insets.top + 120,
								shadowOpacity: isDarkMode ? 0.45 : 0.12,
							},
						]}
					>
						{options.map((option, index) => (
							<React.Fragment key={option.value}>
								{index > 0 && <View style={styles.menuDivider} />}
								<Pressable
									onPress={() => handleSelectOption(option.value)}
									style={pressableOpacityStyle({
										style: styles.menuItem,
										activeOpacity: 0.85,
									})}
								>
									<Text
										style={[
											styles.menuItemText,
											value === option.value && styles.menuItemTextActive,
										]}
									>
										{option.label}
									</Text>
									{value === option.value && (
										<MaterialIcons name="check" size={20} color={'black'} />
									)}
								</Pressable>
							</React.Fragment>
						))}
					</View>
				</Pressable>
			</Modal>
		</>
	);
}

const styles = (colors) =>
	StyleSheet.create({
		dropdownButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: colors.card,
			borderWidth: 1,
			borderColor: colors.border.default,
			borderRadius: 12,
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
			minWidth: 160,
			...Platform.select({
				ios: {
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.08,
					shadowRadius: 4,
				},
				android: {
					elevation: 2,
				},
			}),
		},
		dropdownButtonText: {
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.primary,
			marginRight: SPACING.xs,
		},
		modalOverlay: {
			flex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.4)',
		},
		dropdownMenu: {
			position: 'absolute',
			left: SPACING.lg,
			right: SPACING.lg,
			backgroundColor: colors.card,
			borderWidth: 1,
			borderColor: colors.border.default,
			borderRadius: 16,
			overflow: 'hidden',
			...Platform.select({
				ios: {
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 8 },
					shadowRadius: 24,
				},
				android: {
					elevation: 8,
				},
			}),
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
			color: colors.text.primary,
		},
		menuItemTextActive: {
			color: colors.primary,
			fontWeight: FONTS.weights.semibold,
		},
		menuDivider: {
			height: 1,
			backgroundColor: colors.border.light,
		},
	});
