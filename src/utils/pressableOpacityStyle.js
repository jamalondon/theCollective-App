/**
 * Build a Pressable `style` callback that mimics TouchableOpacity:
 * - Uses `activeOpacity` while pressed.
 * - Uses `disabledOpacity` when disabled.
 *
 * Usage:
 *   <Pressable
 *     disabled={disabled}
 *     style={pressableOpacityStyle({
 *       style: styles.button,
 *       disabled,
 *       activeOpacity: 0.7,
 *     })}
 *   />
 */
export function pressableOpacityStyle({
	style,
	disabled,
	activeOpacity = 0.2,
	disabledOpacity = 0.5,
}) {
	return ({ pressed }) => [
		style,
		disabled
			? { opacity: disabledOpacity }
			: pressed
			? { opacity: activeOpacity }
			: null,
	];
}

