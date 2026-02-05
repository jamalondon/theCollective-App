import { Platform, StyleSheet } from 'react-native';
import { FONTS, SPACING } from './theme';

export const AuthStyles = (colors) => {
	const modalStyles = StyleSheet.create({
		overlay: {
			flex: 1,
			backgroundColor: 'transparent',
			justifyContent: 'center',
		},
		container: {
			paddingHorizontal: SPACING.xl,
		},
		content: {
			backgroundColor: colors.card,
			borderRadius: SPACING.xl,
			width: '100%',
			paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.xl,
		},
		scrollContent: {
			flexGrow: 1,
		},
		header: {
			alignItems: 'center',
			paddingTop: SPACING.md,
			paddingBottom: SPACING.xl,
		},
		handle: {
			width: 40,
			height: 4,
			backgroundColor: colors.border.default,
			borderRadius: 2,
			marginBottom: SPACING.xl,
		},
		title: {
			fontSize: FONTS.sizes.xl,
			fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
		},
		form: {
			paddingHorizontal: SPACING.xxl,
			paddingBottom: SPACING.xl,
		},
		input: {
			backgroundColor: colors.surface,
			borderRadius: SPACING.md,
			padding: SPACING.lg,
			marginBottom: SPACING.lg,
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
			borderWidth: 1,
			borderColor: colors.border.input,
		},
		button: {
			backgroundColor: colors.primary,
			borderRadius: SPACING.md,
			padding: SPACING.lg,
			alignItems: 'center',
			marginTop: SPACING.sm,
			marginBottom: SPACING.lg,
		},
		buttonText: {
			color: colors.text.button,
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
		},
		cancelText: {
			color: colors.text.secondary,
			fontSize: FONTS.sizes.md,
			textAlign: 'center',
			marginTop: SPACING.sm,
		},
		datePicker: {
			width: '100%',
			marginBottom: SPACING.lg,
			borderRadius: SPACING.md,
			padding: SPACING.lg,
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
			borderWidth: 1,
			borderColor: colors.border.input,
			backgroundColor: colors.surface,
			alignSelf: 'center',
		},
		dateButtonText: {
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
		},
		dateButton: {
			backgroundColor: colors.surface,
			borderRadius: SPACING.md,
			padding: SPACING.lg,
			borderWidth: 1,
			borderColor: colors.border.input,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		errorText: {
			color: colors.error,
			fontSize: FONTS.sizes.md,
			textAlign: 'center',
			marginVertical: 10,
		},
	});

	const welcomeStyles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			paddingHorizontal: 32,
		},
		logoContainer: {
			alignItems: 'center',
			marginTop: 40,
			marginBottom: 80, // More space like Twitter
		},
		logo: {
			width: 100,
			height: 100,
		},
		textContainer: {
			alignItems: 'center', // Center align the text
			marginBottom: 60,
			paddingHorizontal: 8,
		},
		title: {
			fontSize: 32,
			//fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
			lineHeight: 38,
			marginBottom: 4,
			textAlign: 'center',
		},
		titleEmphasized: {
			fontSize: 40,
			fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
			lineHeight: 40,
			marginBottom: 4,
			textAlign: 'center',
			letterSpacing: 0.5, // Add slight letter spacing for emphasis
		},
		buttonContainer: {
			alignItems: 'center', // Center the buttons
			marginBottom: 20,
		},
		socialButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.border.default,
			borderRadius: 24, // More rounded like Twitter
			paddingVertical: 14,
			paddingHorizontal: 32,
			marginBottom: 12,
			width: 300, // Fixed width instead of full screen
			maxWidth: '90%', // Responsive for smaller screens
			shadowColor: colors.shadow,
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.05,
			shadowRadius: 2,
			elevation: 1,
		},
		buttonIcon: {
			width: 20,
			height: 20,
			marginRight: 12,
		},
		socialButtonText: {
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.primary,
			textAlign: 'center',
		},
		createAccountButton: {
			backgroundColor: colors.text.primary, // Dark button like Twitter
			borderRadius: 24,
			paddingVertical: 14,
			paddingHorizontal: 32,
			alignItems: 'center',
			alignSelf: 'center', // Center the button
			marginBottom: 20,
			height: 48,
			width: 300, // Fixed width instead of full screen
			maxWidth: '90%', // Responsive for smaller screens
		},
		createAccountText: {
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
			color: colors.background, // White text on dark button
		},
		termsContainer: {
			alignItems: 'center', // Center the terms text
			marginBottom: 40,
			paddingHorizontal: 8,
		},
		termsText: {
			fontSize: FONTS.sizes.sm,
			color: colors.text.secondary,
			textAlign: 'center', // Center align the text
			lineHeight: 18,
		},
		link: {
			color: colors.primary,
			fontWeight: FONTS.weights.normal,
		},
		signInContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center', // Center align like Twitter
			marginBottom: 50,
			paddingHorizontal: 8,
			flexWrap: 'wrap',
		},
		signInText: {
			fontSize: FONTS.sizes.md,
			color: colors.text.secondary,
			marginRight: 4,
		},
		signInLink: {
			fontSize: FONTS.sizes.md,
			color: colors.primary,
			fontWeight: FONTS.weights.normal,
		},
	});

	const SmsVerificationStyles = StyleSheet.create({
		modalOverlay: {
			flex: 1,
			backgroundColor: 'rgba(0,0,0,0.5)',
			justifyContent: 'center',
			alignItems: 'center',
		},
		modalContent: {
			width: '90%',
			borderRadius: 16,
			padding: 20,
			backgroundColor: colors.background,
		},
		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 12,
		},
		closeButton: {
			padding: 8,
		},
		closeButtonText: {
			color: colors.text.primary,
			fontSize: 18,
		},
		title: {
			flex: 1,
			textAlign: 'center',
			color: colors.text.primary,
			fontSize: 20,
			fontWeight: '600',
		},
		subtitle: {
			color: colors.text.secondary,
			fontSize: 14,
			marginTop: 8,
		},
		emailText: {
			color: colors.text.primary,
			fontSize: 16,
			fontWeight: '500',
			marginBottom: 10,
		},
		errorText: {
			color: colors.error || '#e53935',
			marginBottom: 8,
		},
		input: {
			borderWidth: 1,
			borderColor: colors.border || '#444',
			borderRadius: 10,
			paddingHorizontal: 14,
			paddingVertical: 12,
			color: colors.text.primary,
			fontSize: 18,
		},
		verifyButton: {
			marginTop: 14,
			backgroundColor: colors.primary,
			paddingVertical: 12,
			borderRadius: 10,
			alignItems: 'center',
		},
		verifyButtonDisabled: {
			opacity: 0.5,
		},
		verifyButtonText: {
			color: colors.background,
			fontSize: 16,
			fontWeight: '600',
		},
		resendButton: {
			paddingVertical: 10,
			alignItems: 'center',
		},
		resendButtonText: {
			color: colors.link || colors.primary,
			fontSize: 14,
		},
	});

	const createPrayerRequestStyles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContainer: {
			flex: 1,
		},
		input: {
			flex: 1,
			fontSize: FONTS.sizes.lg,
			color: colors.text.primary,
			paddingHorizontal: SPACING.lg,
			paddingTop: SPACING.lg,
			minHeight: 200,
			textAlignVertical: 'top',
		},
		footerRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			marginTop: SPACING.sm,
			marginBottom: SPACING.sm,
		},
		anonymousContainer: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		checkbox: {
			transform: [{ scale: 1.3 }],
		},
		anonymousLabel: {
			fontSize: FONTS.sizes.sm,
			color: colors.text.primary,
			marginLeft: SPACING.sm,
		},
		characterCount: {
			fontSize: FONTS.sizes.sm,
			color: colors.text.secondary,
		},
		footer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.lg,
			borderTopWidth: 1,
			borderTopColor: colors.border.default,
			paddingBottom: SPACING.xxxl,
		},
		imageButton: {
			padding: SPACING.md,
			borderRadius: SPACING.lg,
			backgroundColor: colors.surface,
		},
		submitButton: {
			backgroundColor: colors.primary,
			paddingVertical: SPACING.md,
			paddingHorizontal: SPACING.xl,
			borderRadius: SPACING.lg,
			minWidth: 180,
		},
		submitButtonDisabled: {
			opacity: 0.5,
		},
		submitButtonLoading: {
			backgroundColor: colors.border?.default || colors.surface,
		},
		submitButtonText: {
			color: colors.text.button,
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
			textAlign: 'center',
		},
		errorModalOverlay: {
			flex: 1,
			backgroundColor: 'rgba(0,0,0,0.55)',
			justifyContent: 'center',
			alignItems: 'center',
			padding: SPACING.xl,
		},
		errorModalCard: {
			width: '100%',
			maxWidth: 440,
			backgroundColor: colors.surface,
			borderRadius: SPACING.lg,
			padding: SPACING.xl,
			borderWidth: 1,
			borderColor: colors.border.default,
		},
		errorModalTitle: {
			color: colors.text.primary,
			fontSize: FONTS.sizes.lg,
			fontWeight: FONTS.weights.bold,
			marginBottom: SPACING.md,
		},
		errorModalMessage: {
			color: colors.text.secondary,
			fontSize: FONTS.sizes.md,
			lineHeight: 20,
			marginBottom: SPACING.xl,
		},
		errorModalButton: {
			alignSelf: 'flex-end',
			backgroundColor: colors.primary,
			paddingVertical: SPACING.md,
			paddingHorizontal: SPACING.xl,
			borderRadius: SPACING.lg,
		},
		errorModalButtonText: {
			color: colors.text.button,
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
		},
		imageContainer: {
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
			maxHeight: 120,
		},
		imageWrapper: {
			position: 'relative',
			marginRight: SPACING.md,
		},
		image: {
			width: 100,
			height: 100,
			borderRadius: SPACING.md,
		},
		removeImage: {
			position: 'absolute',
			top: -8,
			right: -8,
			backgroundColor: colors.error,
			borderRadius: 12,
			width: 24,
			height: 24,
			justifyContent: 'center',
			alignItems: 'center',
		},
	});

	const createEventStyles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContent: {
			padding: SPACING.xl,
		},
		header: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingTop: SPACING.lg,
			paddingBottom: SPACING.md,
		},
		headerTitle: {
			fontSize: FONTS.sizes.xl,
			fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
			marginLeft: SPACING.md,
		},
		label: {
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.primary,
			marginBottom: SPACING.sm,
			marginTop: SPACING.lg,
		},
		input: {
			backgroundColor: colors.surface,
			borderRadius: SPACING.md,
			padding: SPACING.lg,
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
			borderWidth: 1,
			borderColor: colors.border.input,
		},
		multilineInput: {
			minHeight: 120,
			textAlignVertical: 'top',
		},
		dateButton: {
			backgroundColor: colors.surface,
			borderRadius: SPACING.md,
			padding: SPACING.lg,
			borderWidth: 1,
			borderColor: colors.border.input,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		dateButtonText: {
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
		},
		dateButtonPlaceholder: {
			color: colors.text.secondary,
		},
		submitButton: {
			backgroundColor: colors.primary,
			borderRadius: SPACING.md,
			padding: SPACING.lg,
			alignItems: 'center',
			marginTop: SPACING.xxl,
			marginBottom: SPACING.xl,
		},
		submitButtonDisabled: {
			opacity: 0.5,
		},
		submitButtonText: {
			color: colors.text.button,
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
		},
		attendeeContainer: {
			marginTop: SPACING.md,
		},
		attendeeChip: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.postTypes.event.background,
			borderRadius: SPACING.lg,
			paddingVertical: SPACING.sm,
			paddingHorizontal: SPACING.md,
			marginRight: SPACING.sm,
			marginBottom: SPACING.sm,
		},
		attendeeChipText: {
			color: colors.postTypes.event.tagText,
			fontSize: FONTS.sizes.sm,
			marginRight: SPACING.sm,
		},
		attendeeChipContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
		searchResultItem: {
			padding: SPACING.md,
			borderBottomWidth: 1,
			borderBottomColor: colors.border.default,
			backgroundColor: colors.surface,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		searchResultText: {
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
		},
		searchResultsContainer: {
			maxHeight: 200,
			backgroundColor: colors.surface,
			borderRadius: SPACING.md,
			borderWidth: 1,
			borderColor: colors.border.default,
			marginTop: SPACING.sm,
		},
		searchResultImage: {
			width: 40,
			height: 40,
			borderRadius: 20,
			marginRight: SPACING.md,
		},
		searchResultTextContainer: {
			flex: 1,
		},
	});

	const prayerRequestDetailStyles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContent: {
			paddingBottom: SPACING.xxxl,
		},
		header: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingTop: SPACING.lg,
			paddingBottom: SPACING.md,
		},
		titleContainer: {
			alignItems: 'center',
			paddingHorizontal: SPACING.xl,
			paddingTop: SPACING.lg,
			paddingBottom: SPACING.md,
			paddingHorizontal: 0,
			paddingVertical: SPACING.md,
			alignItems: 'center',
			overflow: 'visible',
			textAlign: 'center',
		},
		userInfoRow: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
		},
		profilePicture: {
			width: 44,
			height: 44,
			borderRadius: 22,
			marginRight: SPACING.md,
		},
		userInfoText: {
			flex: 1,
		},
		userName: {
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.primary,
		},
		dateText: {
			fontSize: FONTS.sizes.sm,
			color: colors.text.secondary,
			marginTop: 2,
		},
		contentContainer: {
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
		},
		actionsRow: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingBottom: SPACING.md,
			gap: SPACING.md,
		},
		actionPill: {
			flexDirection: 'row',
			alignItems: 'center',
			alignSelf: 'flex-start',
			backgroundColor: colors.surface,
			borderRadius: 999,
			paddingVertical: SPACING.sm,
			paddingHorizontal: SPACING.md,
		},
		actionPillActive: {
			backgroundColor: colors.postTypes.prayerRequest.tag,
		},
		actionPillText: {
			marginLeft: SPACING.xs,
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.secondary,
		},
		actionPillTextActive: {
			color: colors.postTypes.prayerRequest.tagText,
		},
		contentText: {
			fontSize: FONTS.sizes.lg,
			color: colors.text.primary,
			lineHeight: 26,
		},
		photosContainer: {
			paddingHorizontal: SPACING.lg,
			//paddingVertical: SPACING.md,
			width: '100%',
			height: 300,
		},
		photo: {
			width: '90%',
			height: 250,
			borderRadius: 22,
			marginBottom: SPACING.md,
			backgroundColor: 'red',
		},
		divider: {
			height: 1,
			backgroundColor: colors.border.default,
			marginHorizontal: SPACING.lg,
			marginVertical: SPACING.lg,
		},
		commentsSection: {
			paddingHorizontal: SPACING.lg,
		},
		commentsSectionTitle: {
			fontSize: FONTS.sizes.lg,
			fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
			marginBottom: SPACING.md,
		},
		commentItem: {
			flexDirection: 'row',
			paddingVertical: SPACING.md,
			borderBottomWidth: 1,
			borderBottomColor: colors.border.default,
		},
		commentProfilePic: {
			width: 36,
			height: 36,
			borderRadius: 18,
			marginRight: SPACING.md,
		},
		commentContent: {
			flex: 1,
		},
		commentUserName: {
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.primary,
		},
		commentText: {
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
			marginTop: 4,
			lineHeight: 20,
		},
		commentDate: {
			fontSize: FONTS.sizes.xs,
			color: colors.text.secondary,
			marginTop: 4,
		},
		emptyComments: {
			fontSize: FONTS.sizes.md,
			color: colors.text.secondary,
			textAlign: 'center',
			paddingVertical: SPACING.xl,
		},
		commentInputContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
			borderTopWidth: 1,
			borderTopColor: colors.border.default,
			backgroundColor: colors.background,
		},
		commentInput: {
			flex: 1,
			backgroundColor: colors.surface,
			borderRadius: SPACING.lg,
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
			maxHeight: 100,
		},
		sendButton: {
			marginLeft: SPACING.md,
			backgroundColor: colors.primary,
			borderRadius: SPACING.lg,
			padding: SPACING.md,
		},
		sendButtonDisabled: {
			opacity: 0.5,
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		errorContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: SPACING.xl,
		},
		errorText: {
			fontSize: FONTS.sizes.md,
			color: colors.error,
			textAlign: 'center',
		},
	});

	const eventDetailStyles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		scrollContent: {
			paddingBottom: SPACING.xxxl,
		},
		header: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingTop: SPACING.lg,
			paddingBottom: SPACING.md,
		},
		titleContainer: {
			paddingHorizontal: SPACING.lg,
			paddingTop: SPACING.lg,
			paddingBottom: SPACING.sm,
		},
		title: {
			fontSize: FONTS.sizes.xxl,
			fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
		},
		typeTag: {
			alignSelf: 'flex-start',
			paddingHorizontal: SPACING.md,
			paddingVertical: SPACING.xs,
			borderRadius: 4,
			marginBottom: SPACING.sm,
			backgroundColor: colors.postTypes.event.tag,
		},
		typeTagText: {
			fontSize: FONTS.sizes.xs,
			fontWeight: FONTS.weights.semibold,
			letterSpacing: 0.5,
			color: colors.postTypes.event.tagText,
		},
		metaContainer: {
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.sm,
		},
		metaRow: {
			flexDirection: 'row',
			alignItems: 'center',
			marginBottom: SPACING.sm,
		},
		metaIcon: {
			marginRight: SPACING.sm,
		},
		metaText: {
			fontSize: FONTS.sizes.md,
			color: colors.text.secondary,
		},
		descriptionContainer: {
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
		},
		sectionTitle: {
			fontSize: FONTS.sizes.lg,
			fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
			marginBottom: SPACING.md,
		},
		descriptionText: {
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
			lineHeight: 24,
		},
		divider: {
			height: 1,
			backgroundColor: colors.border.default,
			marginHorizontal: SPACING.lg,
			marginVertical: SPACING.lg,
		},
		attendeesSection: {
			paddingHorizontal: SPACING.lg,
		},
		attendeesHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: SPACING.md,
		},
		attendeeCount: {
			fontSize: FONTS.sizes.sm,
			color: colors.text.secondary,
		},
		attendeesList: {
			paddingVertical: SPACING.sm,
		},
		attendeeItem: {
			alignItems: 'center',
			marginRight: SPACING.lg,
			marginBottom: SPACING.md,
			width: 70,
		},
		attendeeProfilePic: {
			width: 50,
			height: 50,
			borderRadius: 25,
			marginBottom: SPACING.xs,
		},
		attendeeName: {
			fontSize: FONTS.sizes.xs,
			color: colors.text.primary,
			textAlign: 'center',
		},
		emptyAttendees: {
			fontSize: FONTS.sizes.md,
			color: colors.text.secondary,
			paddingVertical: SPACING.md,
		},
		joinButtonContainer: {
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
		},
		joinButton: {
			backgroundColor: colors.primary,
			borderRadius: SPACING.md,
			paddingVertical: SPACING.lg,
			alignItems: 'center',
		},
		joinButtonText: {
			color: colors.text.button,
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
		},
		actionsRow: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingBottom: SPACING.md,
			gap: SPACING.md,
		},
		actionPill: {
			flexDirection: 'row',
			alignItems: 'center',
			alignSelf: 'flex-start',
			backgroundColor: colors.surface,
			borderRadius: 999,
			paddingVertical: SPACING.sm,
			paddingHorizontal: SPACING.md,
		},
		actionPillActive: {
			backgroundColor: colors.postTypes.event.tag,
		},
		actionPillText: {
			marginLeft: SPACING.xs,
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.secondary,
		},
		leaveButton: {
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.border.default,
		},
		leaveButtonText: {
			color: colors.text.primary,
		},
		commentsSection: {
			paddingHorizontal: SPACING.lg,
		},
		commentsHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: SPACING.md,
		},
		commentCount: {
			fontSize: FONTS.sizes.sm,
			color: colors.text.secondary,
		},
		commentsList: {
			marginTop: SPACING.sm,
		},
		commentItem: {
			flexDirection: 'row',
			paddingVertical: SPACING.md,
			borderBottomWidth: 1,
			borderBottomColor: colors.border.default,
			alignItems: 'center',
		},
		commentProfilePic: {
			width: 42,
			height: 42,
			borderRadius: 18,
			marginRight: SPACING.md,
			backgroundColor: colors.surface,
		},
		commentContent: {
			flex: 1,
		},
		commentHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		commentAuthor: {
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.primary,
		},
		commentUserName: {
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.semibold,
			color: colors.text.primary,
		},
		commentText: {
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
			marginTop: 4,
			lineHeight: 20,
		},
		commentDate: {
			fontSize: FONTS.sizes.xs,
			color: colors.text.secondary,
		},
		deleteButton: {
			padding: SPACING.sm,
			marginLeft: SPACING.sm,
			alignSelf: 'center',
		},
		emptyComments: {
			fontSize: FONTS.sizes.md,
			color: colors.text.secondary,
			textAlign: 'center',
			paddingVertical: SPACING.xl,
		},
		commentInputContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
			borderTopWidth: 1,
			borderTopColor: colors.border.default,
			backgroundColor: colors.background,
		},
		commentInput: {
			flex: 1,
			backgroundColor: colors.surface,
			borderRadius: SPACING.lg,
			paddingHorizontal: SPACING.lg,
			paddingVertical: SPACING.md,
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
			maxHeight: 100,
		},
		sendButton: {
			marginLeft: SPACING.md,
			backgroundColor: colors.primary,
			borderRadius: SPACING.lg,
			padding: SPACING.md,
		},
		sendButtonDisabled: {
			opacity: 0.5,
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		errorContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: SPACING.xl,
		},
		errorText: {
			fontSize: FONTS.sizes.md,
			color: colors.error,
			textAlign: 'center',
		},
	});

	const profileStyles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		header: {
			flexDirection: 'row',
			justifyContent: 'flex-end',
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingTop: SPACING.lg,
			paddingBottom: SPACING.md,
		},
		settingsButton: {
			padding: SPACING.sm,
		},
		profileSection: {
			alignItems: 'center',
			paddingVertical: SPACING.xxl,
		},
		profilePictureContainer: {
			position: 'relative',
			marginBottom: SPACING.lg,
		},
		profilePicture: {
			width: 120,
			height: 120,
			borderRadius: 60,
			backgroundColor: colors.surface,
		},
		profilePicturePlaceholder: {
			width: 120,
			height: 120,
			borderRadius: 60,
			backgroundColor: colors.surface,
			justifyContent: 'center',
			alignItems: 'center',
		},
		fullName: {
			fontSize: FONTS.sizes.xl,
			fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
			marginBottom: SPACING.xs,
		},
		username: {
			fontSize: FONTS.sizes.md,
			color: colors.text.secondary,
		},
		statsContainer: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			paddingVertical: SPACING.xl,
			paddingHorizontal: SPACING.lg,
			borderTopWidth: 1,
			borderBottomWidth: 1,
			borderColor: colors.border.default,
			marginHorizontal: SPACING.lg,
		},
		statItem: {
			alignItems: 'center',
			flex: 1,
		},
		statNumber: {
			fontSize: FONTS.sizes.xl,
			fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
			marginBottom: SPACING.xs,
		},
		statLabel: {
			fontSize: FONTS.sizes.sm,
			color: colors.text.secondary,
			textAlign: 'center',
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		errorContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: SPACING.xl,
		},
		errorText: {
			fontSize: FONTS.sizes.md,
			color: colors.error,
			textAlign: 'center',
			marginBottom: SPACING.lg,
		},
		retryButton: {
			backgroundColor: colors.primary,
			paddingVertical: SPACING.md,
			paddingHorizontal: SPACING.xl,
			borderRadius: SPACING.md,
		},
		retryButtonText: {
			color: colors.text.button,
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
		},
		// Settings Modal Styles
		modalOverlay: {
			flex: 1,
			backgroundColor: 'transparent',
			justifyContent: 'flex-end',
		},
		modalContent: {
			backgroundColor: colors.card,
			borderTopLeftRadius: SPACING.xl,
			borderTopRightRadius: SPACING.xl,
			paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.xl,
			maxHeight: '80%',
		},
		modalHeader: {
			alignItems: 'center',
			paddingTop: SPACING.md,
			paddingBottom: SPACING.lg,
			borderBottomWidth: 1,
			borderBottomColor: colors.border.default,
		},
		modalHandle: {
			width: 40,
			height: 4,
			backgroundColor: colors.border.default,
			borderRadius: 2,
			marginBottom: SPACING.lg,
		},
		modalTitle: {
			fontSize: FONTS.sizes.lg,
			fontWeight: FONTS.weights.bold,
			color: colors.text.primary,
		},
		modalBody: {
			paddingHorizontal: SPACING.lg,
			paddingTop: SPACING.lg,
		},
		settingsOption: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingVertical: SPACING.lg,
			borderBottomWidth: 1,
			borderBottomColor: colors.border.default,
		},
		settingsOptionLeft: {
			flexDirection: 'row',
			alignItems: 'center',
			flex: 1,
		},
		settingsOptionIcon: {
			marginRight: SPACING.md,
		},
		settingsOptionText: {
			fontSize: FONTS.sizes.md,
			color: colors.text.primary,
		},
		settingsOptionSubtext: {
			fontSize: FONTS.sizes.sm,
			color: colors.text.secondary,
			marginTop: 2,
		},
		signOutButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			paddingVertical: SPACING.lg,
			marginTop: SPACING.lg,
			backgroundColor: colors.error,
			borderRadius: SPACING.md,
		},
		signOutButtonText: {
			fontSize: FONTS.sizes.md,
			fontWeight: FONTS.weights.semibold,
			color: '#ffffff',
			marginLeft: SPACING.sm,
		},
		uploadingOverlay: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			borderRadius: 60,
			justifyContent: 'center',
			alignItems: 'center',
		},
	});

	return {
		modalStyles,
		welcomeStyles,
		SmsVerificationStyles,
		createPrayerRequestStyles,
		createEventStyles,
		prayerRequestDetailStyles,
		eventDetailStyles,
		profileStyles,
	};
};

export const AppStyles = (colors) => {
	const FeedCardStyles = StyleSheet.create({
		container: {
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
		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		deleteButton: {
			padding: SPACING.xs,
		},
		accentBorder: {
			width: 4,
		},
		content: {
			flex: 1,
			padding: SPACING.lg,
		},
		authorRow: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: SPACING.sm,
			marginBottom: SPACING.sm,
		},
		avatar: {
			width: 28,
			height: 28,
			borderRadius: 14,
			overflow: 'hidden',
			borderWidth: 1,
			alignItems: 'center',
			justifyContent: 'center',
		},
		avatarImage: {
			width: '100%',
			height: '100%',
		},
		avatarInitials: {
			fontSize: FONTS.sizes.xs,
			fontWeight: FONTS.weights.semibold,
		},
		authorName: {
			flex: 1,
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.medium,
		},
		typeTag: {
			alignSelf: 'flex-start',
			paddingHorizontal: SPACING.sm,
			paddingVertical: SPACING.xs,
			borderRadius: 4,
			marginBottom: SPACING.sm,
		},
		typeTagText: {
			fontSize: FONTS.sizes.xs,
			fontWeight: FONTS.weights.semibold,
			letterSpacing: 0.5,
		},
		title: {
			fontSize: FONTS.sizes.lg,
			fontWeight: FONTS.weights.bold,
			marginBottom: SPACING.sm,
			lineHeight: 24,
		},
		description: {
			fontSize: FONTS.sizes.sm,
			lineHeight: 20,
			marginBottom: SPACING.md,
		},
		metaContainer: {
			gap: SPACING.xs,
		},
		metaItem: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		metaText: {
			fontSize: FONTS.sizes.xs,
			fontWeight: FONTS.weights.regular,
		},
		actionsRow: {
			flexDirection: 'row',
			marginTop: SPACING.md,
		},
		actionButton: {
			flexDirection: 'row',
			alignItems: 'center',
			alignSelf: 'flex-start',
			paddingHorizontal: SPACING.md,
			paddingVertical: SPACING.sm,
			borderRadius: 999,
			gap: SPACING.xs,
		},
		actionText: {
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.semibold,
		},
	});

	const likeButtonStyles = StyleSheet.create({
		button: {
			flexDirection: 'row',
			alignItems: 'center',
			alignSelf: 'flex-start',
			paddingHorizontal: SPACING.md,
			paddingVertical: SPACING.sm,
			borderRadius: 999,
			gap: SPACING.xs,
		},
		text: {
			fontSize: FONTS.sizes.sm,
			fontWeight: FONTS.weights.semibold,
		},
	});

	return {
		FeedCardStyles,
		likeButtonStyles,
	};
};
