# QuickChat WA – Direct Message for WhatsApp

> **Send WhatsApp messages to any phone number without saving the contact.**

A production-ready **Expo React Native** Android application built with TypeScript, React Navigation, AsyncStorage, and Google AdMob.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Direct Message** | Open WhatsApp chat to any number instantly |
| **Country Code Picker** | 40+ countries with searchable flag picker |
| **Optional Pre-fill** | Include a message before opening WhatsApp |
| **Input Validation** | Validates 7–15 digit international numbers |
| **Recent Numbers** | Saves last 20 numbers via AsyncStorage |
| **AdMob Ads** | Banner on Home, interstitial every 3 sends |
| **Settings** | Privacy Policy, Terms, Contact Us, Version |
| **Feedback Form** | Opens email client with pre-filled message |

---

## 🏗️ Project Structure

```
QuickChatWA/
├── App.tsx                  # Entry point
├── app.json                 # Expo config
├── google-services.json     # AdMob (replace with real keys)
├── src/
│   ├── components/
│   │   └── BannerAdComponent.tsx
│   ├── constants/
│   │   ├── index.ts         # App config, AdMob IDs, country codes
│   │   └── theme.ts         # Colors, spacing, typography
│   ├── navigation/
│   │   ├── RootNavigator.tsx   # Bottom tab navigator
│   │   └── SettingsStack.tsx   # Settings stack navigator
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Main messaging screen
│   │   ├── RecentScreen.tsx     # Recent numbers list
│   │   ├── SettingsScreen.tsx   # Settings menu
│   │   ├── PrivacyPolicyScreen.tsx
│   │   ├── TermsConditionsScreen.tsx
│   │   └── ContactUsScreen.tsx
│   ├── services/
│   │   ├── adMobService.ts      # Interstitial ad management
│   │   └── storageService.ts    # AsyncStorage CRUD
│   └── utils/
│       └── phoneUtils.ts        # Validation & URL builder
├── assets/                  # Icons and splash (add your own)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI
- Android Studio (for Android emulator) or physical device
- Expo Go app (for quick preview)

### Installation

```bash
# 1. Navigate to project
cd QuickChatWA

# 2. Install dependencies
npm install

# 3. Start Expo dev server
npx expo start
```

Then press **`a`** to open on Android emulator, or scan the QR code with **Expo Go** on your phone.

---

## 📱 Running on Android

```bash
# Start with Android target
npx expo start --android

# Or with Expo Go
npx expo start
# then press 'a'
```

---

## 🔑 AdMob Configuration

### 1. Replace Test IDs with Real IDs

Edit `src/constants/index.ts`:

```typescript
export const ADMOB_IDS = {
  android: {
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',       // Your real banner ID
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // Your real interstitial ID
    appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',        // Your App ID
  },
  // ...
};
```

### 2. Update `app.json`

```json
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
      "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
    }
  ]
]
```

### 3. Update `google-services.json`

Replace the placeholder `google-services.json` with your real one from Firebase Console.

> **Note:** The current setup uses Google's official test Ad Unit IDs, which are safe to use during development.

---

## 🎨 Adding App Assets

Replace the placeholder assets in `/assets/`:

| File | Dimensions | Purpose |
|---|---|---|
| `icon.png` | 1024×1024 | App icon |
| `splash.png` | 1284×2778 | Splash screen |
| `adaptive-icon.png` | 1024×1024 | Android adaptive icon |
| `favicon.png` | 196×196 | Web favicon |

You can use tools like [Expo's Asset Generator](https://expo.dev/tools/app-icon) or Adobe Express.

---

## 🏭 Production Build (EAS Build)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS
eas build:configure

# Build Android APK
eas build --platform android --profile preview

# Build Android AAB (Play Store)
eas build --platform android --profile production
```

---

## ⚠️ Important Notes

1. **WhatsApp must be installed** on the user's device for deep links to work.
2. **Not affiliated with WhatsApp** — this app uses public `wa.me` links.
3. **AdMob test IDs** are used by default — replace before publishing.
4. The `google-services.json` placeholder must be replaced with your real Firebase project config.

---

## 🔒 Privacy & Legal

- No personal data is stored on servers
- Phone numbers stored **only locally** on device via AsyncStorage
- AdMob integration disclosed in Privacy Policy
- Users can clear recent numbers at any time

---

## 📧 Support

Email: support@quickchatwa.app

---

## 📄 License

MIT License — See LICENSE file for details.
