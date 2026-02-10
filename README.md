# The Collective App 🙏

A React Native mobile application designed to connect young Christians at the Collective church service. The app fosters community engagement by enabling members to share prayer requests, organize events, view sermons, and stay connected with their faith community.

## 📱 About The Project

The Collective App serves as a digital hub for the Collective church community, providing a platform where members can:

- **Create & Share Prayer Requests** - Share personal prayer needs and support others in their faith journey
- **Organize Community Events** - Create and discover church events, gatherings, and social activities
- **Access Sermons** - Browse sermon series and messages
- **Connect with the Team** - Learn about church leadership and ministry teams
- **Manage Your Profile** - Customize your experience and notification preferences

The app aims to strengthen community bonds and make it easier for young Christians to engage with their church community both online and offline.

## 🛠️ Tech Stack

### Core Technologies

- **[React Native](https://reactnative.dev/)** (0.81.5) - Cross-platform mobile development
- **[Expo](https://expo.dev/)** (SDK 54) - Development platform and tooling
- **[Expo Router](https://docs.expo.dev/router/introduction/)** (6.0) - File-based navigation system

### State Management & Data

- **[Redux Toolkit](https://redux-toolkit.js.org/)** (2.9) - Global state management
- **[Axios](https://axios-http.com/)** (1.12) - HTTP client for API communication
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Local data persistence

### Key Features & Libraries

- **[@expo/vector-icons](https://icons.expo.fyi/)** - Icon library
- **[Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)** - Push notification support
- **[Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** - Image selection functionality
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** - Smooth animations
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** - Touch gesture handling
- **[Sentry](https://sentry.io/)** - Error tracking and monitoring

### Development Tools

- **ESLint** - Code linting and formatting
- **TypeScript** - Type definitions support
- **EAS Build** - Cloud build service

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g expo-cli`)
- **iOS Simulator** (Mac only) or **Android Emulator** (via Android Studio)
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/theCollective-App.git
   cd theCollective-App
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   EXPO_PUBLIC_API_URL=https://your-api-url.com/api
   ```

   Replace the API URL with your backend server endpoint.

4. **Start the development server**

   ```bash
   npm start
   # or
   npx expo start
   ```

5. **Run the app**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with **Expo Go** app on your physical device
   - Press `w` for web (experimental)

### Alternative Start Commands

```bash
# Start with cache cleared
npm run start:clear

# Start with tunnel mode (for testing on physical devices)
npm run start:tunnel

# Run on specific platforms
npm run android
npm run ios
npm run web
```

## 📁 Project Structure

```
theCollective-App/
├── app/                      # Expo Router file-based routing
│   ├── (app)/               # Main app screens (authenticated)
│   │   ├── index.js         # Home feed
│   │   ├── profile.js       # User profile
│   │   └── meet-the-team.js # Church team info
│   ├── (auth)/              # Authentication flow
│   │   ├── sign-in.js
│   │   ├── sign-up.js
│   │   └── sms-verification.js
│   ├── event/[id].js        # Dynamic event detail page
│   └── prayer-request/[id].js # Dynamic prayer request page
├── src/
│   ├── API/                 # API configuration
│   │   ├── ServerAPI.js     # Axios instance
│   │   └── GoogleAPI.js     # Google services integration
│   ├── components/          # Reusable UI components
│   ├── constants/           # Theme, colors, fonts, spacing
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Redux slices and thunks
│   │   ├── userSlice.js
│   │   ├── eventSlice.js
│   │   ├── prayerRequestSlice.js
│   │   └── sermonSlice.js
│   ├── utils/               # Utility functions
│   └── notifications/       # Push notification setup
├── assets/                  # Images, fonts, and static files
└── android/                 # Native Android configuration
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Setting Up for Development

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/theCollective-App.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and ensure code quality
   ```bash
   npm run lint
   ```
5. **Test thoroughly** on both iOS and Android if possible
6. **Commit your changes**
   ```bash
   git commit -m "Add: description of your feature"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request** with a clear description of your changes

### Development Guidelines

- Follow the existing code style and component patterns
- Use Redux Toolkit for state management (see `src/store/`)
- Utilize the theme system from `src/constants/theme.js`
- Test on both iOS and Android platforms when possible
- Write clear commit messages
- Update documentation for significant changes

### Code Style

- Run `npm run lint` before committing
- Use functional components with hooks
- Follow the Redux Toolkit patterns for async operations (thunks)
- Use the custom `useTheme()` hook for dynamic theming

## 📝 Environment Variables

Required environment variables:

| Variable              | Description          | Example                         |
| --------------------- | -------------------- | ------------------------------- |
| `EXPO_PUBLIC_API_URL` | Backend API base URL | `https://api.thecollective.com` |

## 🔨 Available Scripts

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `npm start`            | Start the Expo development server         |
| `npm run start:clear`  | Start with cache cleared                  |
| `npm run start:tunnel` | Start with tunnel mode for remote testing |
| `npm run android`      | Run on Android emulator/device            |
| `npm run ios`          | Run on iOS simulator/device               |
| `npm run web`          | Run on web browser                        |
| `npm run lint`         | Run ESLint to check code quality          |

## 🏗️ Building for Production

This project uses EAS Build for creating production builds:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

See `eas.json` for build configuration details.

## 📄 License

This project is private and proprietary to the Collective church community.

## 🙌 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Church community members for feedback and support
- All contributors who help improve this app

## 📬 Contact

For questions or support, please contact the development team or open an issue on GitHub.

---

Made with ❤️ for the Collective church community
