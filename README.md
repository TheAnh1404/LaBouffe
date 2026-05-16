# 🍽️ LaBouffe — Food Delivery Mobile App

A production-ready food delivery application built with **React Native (Expo)** and **Firebase**, featuring server-side order processing, real-time updates, and push notifications.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Mobile App                      │
│           (React Native + Expo)                  │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │   Auth   │ │   Cart   │ │  Push Notifs     │ │
│  │ Context  │ │ Context  │ │  (expo-notifs)   │ │
│  └────┬─────┘ └────┬─────┘ └────────┬─────────┘ │
│       │            │                │            │
│  ┌────┴────────────┴────────────────┴──────────┐ │
│  │        Services Layer (api.ts)              │ │
│  └──────────────────┬──────────────────────────┘ │
└─────────────────────┼───────────────────────────┘
                      │ Cloud Functions (HTTPS Callable)
┌─────────────────────┼───────────────────────────┐
│              Firebase Backend                    │
│                                                  │
│  ┌──────────────────┴──────────────────────────┐ │
│  │         Cloud Functions (Node.js)           │ │
│  │  • processOrder — Server-side checkout      │ │
│  │  • onOrderStatusChange — Push notifications │ │
│  │  • onUserCreate — Profile initialization    │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌──────────────┐ ┌──────────┐ ┌──────────────┐ │
│  │  Firestore   │ │   Auth   │ │   Storage    │ │
│  │  (Database)  │ │  (Users) │ │  (Images)    │ │
│  └──────────────┘ └──────────┘ └──────────────┘ │
│                                                  │
│  ┌──────────────┐ ┌──────────────────────────┐  │
│  │  Security    │ │    FCM                   │  │
│  │  Rules       │ │  (Push Notifications)    │  │
│  └──────────────┘ └──────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
LaBouffe/
├── functions/                   # Firebase Cloud Functions (Backend)
│   ├── src/
│   │   ├── index.ts             # Entry point
│   │   ├── orders/
│   │   │   ├── processOrder.ts  # Server-side checkout logic
│   │   │   └── onOrderStatusChange.ts  # Push notification trigger
│   │   └── users/
│   │       └── onUserCreate.ts  # Auto-create user profile
│   ├── package.json
│   └── tsconfig.json
├── firestore.rules              # Firestore Security Rules
├── storage.rules                # Storage Security Rules
├── firebase.json                # Firebase project config
├── .firebaserc                  # Firebase project link
│
└── mobile-app/                  # React Native (Expo) Frontend
    ├── app/                     # Screens (Expo Router)
    │   ├── (auth)/              # Login, Register, Forgot Password
    │   ├── (tabs)/              # Home, Menu, Cart, Restaurants, Profile
    │   ├── food-detail.tsx      # Food detail screen
    │   └── order-history.tsx    # Order history screen
    ├── components/              # Reusable UI components
    ├── config/
    │   └── firebase.ts          # Firebase initialization
    ├── constants/
    │   └── theme.ts             # Design tokens (colors, spacing, etc.)
    ├── context/                 # React Contexts (Auth, Cart, Favorites)
    ├── hooks/                   # Custom hooks (Firestore data, orders)
    ├── services/                # API & notification services
    │   ├── api.ts               # Cloud Functions service layer
    │   └── notifications.ts     # Push notification handler
    └── types/                   # Shared TypeScript types
        ├── food.ts
        ├── order.ts
        ├── user.ts
        └── restaurant.ts
```

---

## 🔐 Security Model

| Collection | Read | Write | Notes |
|---|---|---|---|
| `foods` | ✅ Public | 🔒 Admin only | Menu items |
| `categories` | ✅ Public | 🔒 Admin only | Food categories |
| `restaurants` | ✅ Public | 🔒 Admin only | Restaurant info |
| `orders` | 👤 Owner only | 🔒 Server only | Cloud Functions create orders |
| `users/{uid}` | 👤 Owner only | 👤 Owner only | User profiles |
| `users/{uid}/favorites` | 👤 Owner only | 👤 Owner only | Saved favorites |

**Key principle:** *Orders are NEVER created from the client.* The mobile app sends only `foodId` + `quantity` to a Cloud Function, which validates prices server-side.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### 1. Clone & Install

```bash
git clone https://github.com/TheAnh1404/LaBouffe.git
cd LaBouffe

# Install Cloud Functions dependencies
cd functions && npm install && cd ..

# Install Mobile App dependencies
cd mobile-app && npm install && cd ..
```

### 2. Configure Firebase

```bash
# Login to Firebase
firebase login

# Deploy Security Rules
firebase deploy --only firestore:rules,storage:rules

# Deploy Cloud Functions
firebase deploy --only functions
```

### 3. Run Mobile App

```bash
cd mobile-app
npx expo start
```

---

## 🔧 Cloud Functions

### `processOrder` (HTTPS Callable)
- **Input**: `{ items: [{ foodId: string, quantity: number }] }`
- **Logic**: Validates user auth → Looks up prices in DB → Calculates fees → Creates order
- **Output**: `{ success: boolean, orderId: string, totalAmount: number }`

### `onOrderStatusChange` (Firestore Trigger)
- **Trigger**: Any update to `orders/{orderId}`
- **Logic**: Detects status change → Sends FCM push notification to user

### `onUserCreate` (Auth Trigger)
- **Trigger**: New user registration
- **Logic**: Creates default profile document with `role: 'customer'`

---

## 📱 Tech Stack

| Layer | Technology |
|---|---|
| **Mobile App** | React Native (Expo SDK 54) |
| **Navigation** | Expo Router v6 |
| **Backend** | Firebase Cloud Functions (Node.js 18) |
| **Database** | Cloud Firestore |
| **Auth** | Firebase Authentication |
| **Storage** | Firebase Cloud Storage |
| **Notifications** | Firebase Cloud Messaging + Expo Notifications |
| **Language** | TypeScript (Strict mode) |

---

## 📋 Available Scripts

### Mobile App (`/mobile-app`)
| Command | Description |
|---|---|
| `npx expo start` | Start dev server |
| `npx expo start --android` | Start on Android |
| `npx expo start --ios` | Start on iOS |

### Cloud Functions (`/functions`)
| Command | Description |
|---|---|
| `npm run build` | Compile TypeScript |
| `npm run serve` | Run with Firebase Emulator |
| `npm run deploy` | Deploy to Firebase |
| `npm run logs` | View function logs |

---

## 👤 Author

**TheAnh1404** — [GitHub](https://github.com/TheAnh1404)
