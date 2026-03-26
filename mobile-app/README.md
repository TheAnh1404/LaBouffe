# 🍔 ByteFood – Food Ordering Mobile App

## 📌 Introduction

**ByteFood** is a modern mobile application for food ordering, designed to provide a fast, intuitive, and seamless user experience.
The app allows users to browse food, view details, and place orders efficiently with a clean and user-friendly interface.

This project is developed as part of a university coursework, focusing on real-world mobile app development using modern technologies.

---

## 🚀 Features

* 📱 **Onboarding Experience**

  * Smooth introduction screens with swipe interaction
  * Splash screen with branding

* 🏠 **Home Screen**

  * Food listing with categories
  * Clean and responsive UI

* 🍔 **Food Details**

  * View detailed information of each dish
  * Pricing, description, and ratings

* 🛒 **Cart System**

  * Add/remove items
  * Manage quantities
  * View total price

* 👤 **User Profile**

  * Basic user information management

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React Native (Expo)
* 🚏 Expo Router (File-based navigation)
* 🎨 Custom UI based on Figma design

### Backend (Planned)

* 🟢 Node.js + Express
* 🔥 Firebase / MongoDB (for data storage)

---

## 📂 Project Structure

```bash
app/
 ├── index.tsx          # Entry (redirect to splash)
 ├── splash.tsx         # Splash screen
 ├── onboarding.tsx     # Onboarding screens
 │
 └── (tabs)/
      ├── index.tsx     # Home screen
      ├── cart.tsx      # Cart screen
      ├── profile.tsx   # User profile
      └── _layout.tsx   # Tab navigation

components/
 ├── FoodCard.tsx
 ├── Header.tsx
 └── Button.tsx

assets/
 └── images/
```

---

## 🧠 Development Approach

This project follows a **UI-first development approach**:

1. Design UI from Figma
2. Implement frontend with mock data
3. Define API structure based on UI
4. Build backend services
5. Integrate frontend with backend

---

## 📸 UI Design

The UI is based on a modern food delivery design from Figma, focusing on:

* Minimalism
* Accessibility
* Smooth user experience

---

## ▶️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app

```bash
npx expo start
```

### 3. Open on web or mobile

* Web: press `w`
* Mobile: scan QR with Expo Go

---

## 🎯 Future Improvements

* 🔐 Authentication system
* 💳 Online payment integration
* 📍 Real-time order tracking
* 🤖 Recommendation system (AI-based)

---

## 👨‍💻 Author

* **Nguyễn Thế Anh**

---

## 📄 License

This project is for educational purposes.
