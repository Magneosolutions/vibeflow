// src/firebaseConfig.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:your api key,
  authDomain: "my-app-project.firebaseapp.com",
  projectId: "my-app-project",
  storageBucket: "my-app-project.firebasestorage.app",
  messagingSenderId: "679820915121",
  appId: "1:679820915121:web:ff68938b52ab90d1fc4d90"
};

// Initialize Firebase
// To prevent re-initialization errors, especially with HMR (Hot Module Replacement)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // if already initialized, use that one
}

export const auth = getAuth(app); // Export the auth instance
