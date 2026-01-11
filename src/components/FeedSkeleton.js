import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useThemedStyles';
import { SPACING } from '../constants/theme';

const SkeletonCard = ({ colors, animatedValue }) => {
	// Interpolate the animated value for opacity
	const opacity = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [0.3, 1],
	});

	return (
		<View style={[styles.card, { backgroundColor: colors.card }]}>
			{/* Left accent border placeholder */}
			<View style={[styles.accentBorder, { backgroundColor: colors.border.default }]} />

			{/* Content */}
			<View style={styles.content}>
				{/* Type tag placeholder */}
				<Animated.View
					style={[
						styles.typeTag,
						{
							backgroundColor: colors.border.light,
							opacity,
						},
					]}
				/>

				{/* Title placeholder */}
				<Animated.View
					style={[
						styles.titleLine,
						{
							backgroundColor: colors.border.light,
							opacity,
							marginBottom: SPACING.xs,
						},
					]}
				/>
				<Animated.View
					style={[
						styles.titleLine,
						{
							backgroundColor: colors.border.light,
							opacity,
							width: '60%',
							marginBottom: SPACING.md,
						},
					]}
				/>

				{/* Description placeholder */}
				<Animated.View
					style={[
						styles.descriptionLine,
						{
							backgroundColor: colors.border.light,
							opacity,
							marginBottom: SPACING.xs,
						},
					]}
				/>
				<Animated.View
					style={[
						styles.descriptionLine,
						{
							backgroundColor: colors.border.light,
							opacity,
							marginBottom: SPACING.xs,
						},
					]}
				/>
				<Animated.View
					style={[
						styles.descriptionLine,
						{
							backgroundColor: colors.border.light,
							opacity,
							width: '70%',
							marginBottom: SPACING.md,
						},
					]}
				/>

				{/* Meta info placeholder */}
				<Animated.View
					style={[
						styles.metaLine,
						{
							backgroundColor: colors.border.light,
							opacity,
							width: '40%',
						},
					]}
				/>
			</View>
		</View>
	);
};

const FeedSkeleton = ({ count = 3 }) => {
	const { colors } = useTheme();
	const animatedValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Create a pulsing animation
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(animatedValue, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(animatedValue, {
					toValue: 0,
					duration: 800,
					useNativeDriver: true,
				}),
			])
		);

		animation.start();

		return () => animation.stop();
	}, [animatedValue]);

	return (
		<View style={styles.container}>
			{[...Array(count)].map((_, index) => (
				<SkeletonCard key={index} colors={colors} animatedValue={animatedValue} />
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	card: {
		flexDirection: 'row',
		borderRadius: 12,
		marginHorizontal: SPACING.lg,
		marginVertical: SPACING.sm,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	accentBorder: {
		width: 4,
	},
	content: {
		flex: 1,
		padding: SPACING.lg,
	},
	typeTag: {
		width: 100,
		height: 20,
		borderRadius: 4,
		marginBottom: SPACING.sm,
	},
	titleLine: {
		height: 20,
		borderRadius: 4,
		width: '100%',
	},
	descriptionLine: {
		height: 14,
		borderRadius: 4,
		width: '100%',
	},
	metaLine: {
		height: 12,
		borderRadius: 4,
	},
});

export default FeedSkeleton;

