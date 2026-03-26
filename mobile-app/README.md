# 🍽️ LaBouffe – Food Ordering Mobile App

## 📌 Introduction

**LaBouffe** is a modern mobile food ordering application designed to deliver a seamless and intuitive user experience.
The app enables users to explore a variety of dishes, view detailed information, and place orders efficiently through a clean and responsive interface.

This project is developed as part of a university coursework, with a strong focus on real-world mobile development practices and UI/UX implementation.

---

## 🚀 Features

* 📱 **Onboarding Experience**

  * Smooth swipe-based introduction screens
  * Splash screen with branding

* 🏠 **Home Screen**

  * Browse food items and categories
  * Clean and modern UI

* 🍔 **Food Details**

  * View detailed information of each dish
  * Includes price, description, and ratings

* 🛒 **Cart System**

  * Add/remove items
  * Update quantities
  * View total cost

* 👤 **User Profile**

  * Basic user information management

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React Native (Expo)
* 🚏 Expo Router (File-based navigation)
* 🎨 UI implemented from Figma design

### Backend (Planned)

* 🟢 Node.js + Express
* 🔥 Firebase / MongoDB

---

## 📂 Project Structure

```bash
app/
 ├── index.tsx          # Entry point (redirect to splash)
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

This project follows a **UI-first development strategy**:

1. Design UI from Figma
2. Build frontend using mock data
3. Define API structure based on UI requirements
4. Develop backend services
5. Integrate frontend with backend

---

## 📸 UI Design

The UI is inspired by modern food delivery applications, focusing on:

* Simplicity and clarity
* User-friendly navigation
* Smooth mobile experience

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

### 3. Open the app

* Web: press `w`
* Mobile: scan QR using Expo Go

---

## 🎯 Future Improvements

* 🔐 User authentication
* 💳 Online payment integration
* 📍 Real-time order tracking
* 🤖 AI-based recommendation system

---

## 👨‍💻 Author

* **Nguyễn Thế Anh**

---

## 📄 License

This project is developed for educational purposes.
