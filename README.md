# 🍽️ LaBouffe — Premium Food Delivery Mobile App

A production-ready, feature-rich food delivery application built with **React Native (Expo)** and **Firebase**. It features a robust dual-mode backend architecture (flexible for both Spark and Blaze Firebase plans), real-time order tracking, localized persistent cart, high-fidelity design tokens, and a complete suite of profile dashboard views.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                          Mobile App                         │
│                     (React Native + Expo)                   │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌────────────┐  │
│  │   Auth   │ │   Cart   │ │  Favorites   │ │ Push Notif │  │
│  │ Context  │ │ Context  │ │   Context    │ │(expo-notif)│  │
│  └────┬─────┘ └────┬─────┘ └──────┬───────┘ └─────┬──────┘  │
│       │            │ (AsyncStorage)│              │         │
│  ┌────┴────────────┴──────────────┴───────────────┴──────┐  │
│  │        Services Layer (api.ts - Dual Mode Support)    │  │
│  └────────────────────────┬──────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────┘
                            │ (Dual Mode: API / Direct Write)
┌───────────────────────────┼─────────────────────────────────┐
│                    Firebase Backend                         │
│                                                             │
│  ┌────────────────────────┴──────────────────────────────┐  │
│  │             Cloud Functions (Node.js)                 │  │
│  │  • processOrder — Server checkout & pricing           │  │
│  │  • cancelOrder — Customer cancellation flow           │  │
│  │  • onOrderStatusChange — FCM Push notification trigger│  │
│  │  • onUserCreate — Automatic profile initialization    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │  Firestore   │ │  Firebase    │ │  Cloud       │         │
│  │  Database    │ │  Auth (Users)│ │  Storage     │         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐                          │
│  │ Security     │ │ FCM          │                          │
│  │ Rules        │ │ (Push Notifs)│                          │
│  └──────────────┘ └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Upgrades & Features

### 🛒 High-Security Checkout (Dual-Mode API)
To support different hosting levels, LaBouffe features a unique **Dual-Mode API Service Layer** controlled via the `USE_CLOUD_FUNCTIONS` toggle in `mobile-app/services/api.ts`:
*   **Blaze Plan Mode (Cloud Functions)**: Maximum security. The client submits only food IDs and quantities. Pricing lookup, VAT/fees calculation, and order generation are performed server-side via Node.js Cloud Functions.
*   **Spark Plan Mode (Firestore Fallback)**: Client-side backup writing. Automatically reads server prices from Firestore, performs strict calculation local validations, and writes to Firestore directly under custom security rules ensuring secure client operations.
*   **Idempotency Protection**: Both modes support client-generated UUID keys to prevent double-submit orders from rapid taps.

### 📦 Local Storage Persistence
*   The cart state is synchronized dynamically to `AsyncStorage`. Users can quit the app, and their checkout items are completely preserved upon relaunch.
*   Supports **Order Notes** inputs on checkout to pass custom prep instructions to the kitchen.

### 👤 Profile Dashboard Suite
LaBouffe contains a complete, premium-designed custom screen suite under the user Profile tab:
1.  **💳 Wallet (`/wallet`)**: Interactive available balance visual card, quick top-up buttons (AED 10 - 500), payment methods setup (Cards & Cash), and color-coded transaction logs.
2.  **❤️ Favourite (`/favourite`)**: Reactive saved foods grid loaded dynamically from Firestore, integrated with the app's global cart context.
3.  **📍 Live Order Tracking (`/track`)**: Status pipeline timeline mapping order lifecycle `placed` ➔ `confirmed` ➔ `preparing` ➔ `delivering` ➔ `delivered` in real-time using Firestore `onSnapshot`.
4.  **🆘 Get Help (`/get-help`)**: Searchable FAQ accordions, one-tap support linking (Call / Email), and 24/7 custom support banners.
5.  **ℹ️ About (`/about`)**: Complete branding showcasing application version specs, integrated feature summary cards, open-source disclosures, and social media deep-linking.

---

## 📁 Project Structure

```
LaBouffe/
├── functions/                     # Firebase Cloud Functions (Backend)
│   ├── src/
│   │   ├── index.ts               # Entry point
│   │   ├── orders/
│   │   │   ├── processOrder.ts    # Secure server checkout & pricing
│   │   │   ├── cancelOrder.ts     # Customer order cancellation API
│   │   │   └── onOrderStatusChange.ts # Push notification trigger
│   │   └── users/
│   │       └── onUserCreate.ts    # Profile auto-generator
│   ├── package.json
│   └── tsconfig.json
├── firestore.rules                # Custom security rules supporting client writes
├── firestore.indexes.json         # Composite indexes for history & idempotency
├── storage.rules                  # Storage access rules
├── firebase.json                  # Firebase deployment configuration
│
└── mobile-app/                    # React Native Expo App (Frontend)
    ├── app/                       # Screens (Expo Router)
    │   ├── (auth)/                # Onboarding, Login, Register, Forgot Password
    │   ├── (tabs)/                # Home, Menu, Cart, Restaurants, Profile
    │   ├── food-detail.tsx        # Item specifics
    │   ├── order-history.tsx      # Multi-state order badges & fee breakdowns
    │   ├── wallet.tsx             # Interactive top-ups & transactions
    │   ├── favourite.tsx          # Saved items grid
    │   ├── track.tsx              # Timeline order tracking status
    │   ├── get-help.tsx           # Accordion FAQ & support linking
    │   └── about.tsx              # App specs, legal, & social redirects
    ├── components/                # Reusable premium components
    ├── constants/
    │   └── theme.ts               # Strict COLORS design tokens (Zero hex hardcode)
    ├── context/                   # Global State providers (Auth, Cart, Favorites)
    ├── hooks/                     # Custom data fetch hooks
    └── services/
        ├── api.ts                 # Dual-mode API interface
        └── notifications.ts       # FCM Push service handler
```

---

## 🔐 Security Model

| Collection | Read | Write | Notes |
|---|---|---|---|
| `foods` | ✅ Public | 🔒 Admin only | Menu Catalog |
| `categories` | ✅ Public | 🔒 Admin only | Category labels |
| `restaurants` | ✅ Public | 🔒 Admin only | Restaurant details |
| `orders` | 👤 Owner only | 👤 Owner (limited) | Only allowed to create own & update to `cancelled` if current status is `placed` |
| `users/{uid}` | 👤 Owner only | 👤 Owner only | Private profile metadata |
| `users/{uid}/favorites` | 👤 Owner only | 👤 Owner only | User favorite item records |

*Note: Security rules (`firestore.rules`) enforce strict authorization controls. Only the logged-in owner can touch their respective documents.*

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### 1. Installation

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
# Login
firebase login

# Deploy Rules & Composite Indexes
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

### 3. Choose API Mode (`mobile-app/services/api.ts`)
Set the `USE_CLOUD_FUNCTIONS` toggle in `mobile-app/services/api.ts`:
*   `false` (Default, Spark Plan compatible): Works instantly. Uses direct Firestore client-side writes.
*   `true` (Requires Blaze Plan upgrade): Calls HTTPS Cloud Functions. Deploy functions via `firebase deploy --only functions`.

### 4. Run Mobile App

```bash
cd mobile-app
npx expo start -c
```

---

## 🔧 Backend Functions API

### `processOrder` (HTTPS Callable)
- **Inputs**: `{ items: [{ foodId: string, quantity: number }], note?: string, idempotencyKey?: string }`
- **Output**: `{ success: boolean, orderId: string, totalAmount: number }`

### `cancelOrder` (HTTPS Callable)
- **Inputs**: `{ orderId: string, reason?: string }`
- **Output**: `{ success: boolean, message: string }`
- **Constraint**: Only works for orders still under `placed` status.

---

## 📱 Technology Stack

| Layer | Technology |
|---|---|
| **Mobile Framework** | React Native (Expo SDK 54) |
| **Navigation** | Expo Router v6 (File-based) |
| **State Management** | React Context (Auth, Cart, Favorites) |
| **Local Cache** | `@react-native-async-storage/async-storage` |
| **Database & Auth** | Firebase Firestore, Firebase Authentication |
| **API Endpoints** | Firebase Cloud Functions (Node.js 18 + TS) |
| **Notifications** | FCM + Expo Push Notifications |

---

## 📋 Available Scripts

### Mobile App (`/mobile-app`)
-   `npx expo start -c`: Starts Metro server clearing bundler cache.
-   `npx expo start --android`: Start on Android Emulator.
-   `npx expo start --ios`: Start on iOS Simulator.

### Backend (`/functions`)
-   `npm run build`: Build typescript.
-   `npm run serve`: Launch local Firebase Emulators.
-   `npm run deploy`: Deploy functions to production.

---

## 👤 Project Maintainer

**TheAnh1404** — [GitHub Profile](https://github.com/TheAnh1404)
