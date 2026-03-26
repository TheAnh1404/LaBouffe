<h1 align="center">🍽️ LaBouffe</h1>

<p align="center">
  <strong>A Modern Food Ordering Mobile App</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native Badge" />
  <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo Badge" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Badge" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Badge" />
</p>

## 📌 Introduction

**LaBouffe** is a modern and intuitive mobile food ordering application designed to deliver a seamless user experience. The app empowers users to explore a diverse variety of dishes, view detailed culinary information, and place orders effortlessly through a clean and responsive interface.

Developed as part of a university coursework, this project places a strong emphasis on real-world mobile development practices, robust architecture, and exceptional UI/UX implementation.

---

## 🚀 Features

### 📱 Onboarding Experience
* **Smooth Transitions**: Engaging swipe-based introduction screens to introduce the app.
* **Branded Splash Screen**: A professional initial loading screen.

### 🏠 Home Screen
* **Interactive Browsing**: Effortlessly browse food items across various categories.
* **Modern Interface**: Designed with a clean and visually appealing UI.

### 🍔 Food Details
* **Comprehensive Information**: View essential details for each dish.
* **Rich Content**: Includes pricing, mouth-watering descriptions, and user ratings.

### 🛒 Cart System
* **Dynamic Management**: Easily add or remove items from your cart.
* **Real-time Updates**: Effortlessly update quantities and instantly view total costs.

### 👤 User Profile
* **Personalized Experience**: Manage basic user information and preferences.

---

## 📸 Screenshots

*(Coming Soon - Add app screenshots or GIFs here)*

---

## 🛠️ Tech Stack

### Frontend
* **[React Native (Expo)](https://expo.dev/)** – Framework for building native apps using React.
* **[Expo Router](https://docs.expo.dev/router/introduction/)** – File-based routing for React Native.
* **Figma** – UI/UX design and prototyping.

### Backend (Planned)
* **[Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)** – High-performance server environment.
* **[Firebase](https://firebase.google.com/) / [MongoDB](https://mongodb.com/)** – Flexible, scalable database solutions.

---

## 📂 Project Structure

```bash
mobile-app/             # Frontend React Native application
 ├── app/
 │    ├── index.tsx     # Entry point (redirects to splash)
 │    ├── splash.tsx    # Splash screen
 │    ├── onboarding.tsx# Onboarding screens
 │    │
 │    └── (tabs)/       # Main tab navigation
 │         ├── index.tsx
 │         ├── cart.tsx
 │         ├── profile.tsx
 │         └── _layout.tsx
 │
 ├── components/        # Reusable UI components
 │    ├── FoodCard.tsx
 │    ├── Header.tsx
 │    └── Button.tsx
 │
 └── assets/            # Static images & fonts

backend/                # (Planned) Backend API Services
```

---

## 🧠 Development Approach

This project strictly adheres to a **UI-First Development Strategy**:

1. **Design UI**: Prototype the complete user interface using Figma.
2. **Frontend Mockup**: Build the frontend components utilizing mock data to validate the design.
3. **API Definition**: Define a structured API scheme specifically tailored to UI requirements.
4. **Backend Services**: Develop scalable backend services and endpoints.
5. **Full Integration**: Connect the frontend mobile app with the live backend.

---

## 🎨 UI Design Philosophy

The UI draws inspiration from industry-leading food delivery applications, optimizing for:
* **Simplicity and Clarity**: Minimizing cognitive load.
* **User-friendly Navigation**: Making desired actions accessible within minimal taps.
* **Fluid Performance**: Ensuring a smooth, native-feeling mobile experience.

---

## ▶️ Getting Started

Follow these instructions to run the frontend mobile project locally.

### 1. Clone the repository
```bash
git clone https://github.com/TheAnh1404/LaBouffe.git
cd LaBouffe/mobile-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the application

```bash
npx expo start
```

### 4. Open the application

* **Web**: Press `w` in your terminal.
* **Mobile**: Scan the QR code generated in the terminal using the **Expo Go** app (available on iOS and Android).

---

## 🎯 Future Improvements

- [ ] **🔐 User Authentication**: Secure login and registration.
- [ ] **💳 Payment Integration**: Online payment gateways for seamless checkout.
- [ ] **📍 Order Tracking**: Real-time GPS tracking for food delivery.
- [ ] **🤖 Recommendation System**: AI-driven personalized food recommendations based on user history.

---

## 👨‍💻 Author

**Nguyễn Thế Anh**

---

## 📄 License

This project is developed for **educational purposes**.

---
<p align="center">Made with ❤️ for food lovers</p>
