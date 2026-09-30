# NowFix - Mobile App (Frontend)

NowFix is an on-demand local home-services booking mobile application built with React Native and Expo Router.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Expo Development Server
```bash
npm start
```
Or:
```bash
npm run android
```

### 3. Open on Android (Expo Go)
1. Install **Expo Go** from Google Play Store on your Android device.
2. Make sure your Android device and PC are connected to the same Wi-Fi network.
3. In terminal, run `npm start`.
4. Scan the QR code displayed in the terminal using the Expo Go app.
5. If on different networks or having firewall issues, start with tunnel mode:
   ```bash
   npx expo start --tunnel
   ```

## Included Screens & Flows
- **Splash & Onboarding**: Animated splash screen and feature introduction walkthrough.
- **Authentication**: Mobile number login / sign up with SMS OTP verification (Mock OTP: `123456`).
- **Profile & Account Setup**: Complete profile step, avatar, and basic details.
- **Location Selector**: City and area picker with search and quick-select options.
- **Home Dashboard**: Service categories, urgent bookings banner, and recent service requests.
- **Service Categories**: Full category catalog and detailed service browsing.
- **Tabs**: Home, Categories, Bookings, Messages, and Profile tabs.
