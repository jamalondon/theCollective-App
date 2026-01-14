# AI Coding Guidelines for The Collective App

## Architecture Overview

This is a React Native Expo app using Expo Router for file-based navigation. The app manages community events and prayer requests with Redux Toolkit for state management.

- **Navigation**: Expo Router with file-based routing in `app/` directory (e.g., `app/(auth)/sign-in.js` for auth routes)
- **State Management**: Redux Toolkit slices in `src/store/` with async thunks for API calls
- **API**: Axios instance in `src/API/ServerAPI.js` with base URL from `EXPO_PUBLIC_API_URL`
- **Theming**: Custom hook `useTheme()` returns colors; styles use `LIGHT_COLORS`/`DARK_COLORS` from `src/constants/theme.js`
- **Components**: Reusable components in `src/components/`; use `pressableOpacityStyle` from `src/utils/` for touch feedback

## Key Patterns

- **Redux Flow**: Create async thunks in `*Thunk.js` files, handle responses in slice `extraReducers` with `addCase(fulfilled/rejected)`
- **Navigation**: Use `router.push()` or `router.replace()` from `expo-router`; handle auth redirects in slice reducers
- **Error Handling**: Thunks use `rejectWithValue` for errors; display via `state.errorMessage` in components
- **Styling**: Components import `FONTS`, `SPACING` from `src/constants/theme.js`; use `useTheme()` for dynamic colors
- **API Calls**: All server requests via `ServerAPI` (axios); include auth token from `state.user.token`

## Development Workflow

- **Start App**: `npm run start` or `npx expo start` (supports `--android`, `--ios`, `--web`)
- **Linting**: `npm run lint` (ESLint config in `eslint.config.js`)
- **Build**: Use EAS Build (`eas.json`) for production builds
- **Environment**: Set `EXPO_PUBLIC_API_URL` in `.env` or `.env.local`

## Component Examples

- Feed items use `FeedCard` component with `item.type` ('event' or 'prayer_request') for conditional rendering
- Auth forms in `app/(auth)/` use `useThemedStyles()` for consistent styling
- Push notifications registered via `registerForPushNotificationsAsync` on app start

## File Structure Highlights

- `src/store/userSlice.js`: Central user state with auth, profile, and news feed
- `src/components/Icon.js`: Custom icon component using `@expo/vector-icons`
- `src/hooks/useFormatAgeOfDate.js`: Date formatting utilities
- `assets/images/`: Static images; use `expo-image` for optimized loading
