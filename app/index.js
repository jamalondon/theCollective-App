import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { tryLocalSignIn } from '../src/store/userThunk';

export default function Index() {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.user.token);
	const [isInitialized, setIsInitialized] = useState(false);
	const INITIALIZATION_TIMEOUT = 30000;

	// Try to sign in from local storage OR wait for 30 seconds
	useEffect(() => {
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				reject(new Error('Initialization timed out after 30 seconds'));
			}, INITIALIZATION_TIMEOUT);
		});

		Promise.race([timeoutPromise, dispatch(tryLocalSignIn())])
			.then(() => setIsInitialized(true))
			.catch((error) => {
				console.error(error);
				setIsInitialized(true); // Still mark as initialized even on error
			});
	}, [dispatch, INITIALIZATION_TIMEOUT]);

	// Show loading screen while initializing
	if (!isInitialized) {
		return (
			<View style={styles.container}>
				<Image
					source={require('../assets/images/logo-transparent.png')}
					style={styles.logo}
					resizeMode="contain"
				/>
				<Text style={styles.subtitle}>Loading...</Text>
			</View>
		);
	}

	// Once initialized, redirect based on auth status
	if (token) {
		return <Redirect href="/(app)" />;
	}

	return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	},
	logo: {
		width: 150,
		height: 150,
		marginBottom: 20,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
	},
});
