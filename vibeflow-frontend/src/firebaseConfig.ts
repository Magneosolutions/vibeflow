// src/firebaseConfig.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIR4WJthrMjy6SH4CkHc7PHcKwHYFSSQU",
  authDomain: "my-app-project-461822.firebaseapp.com",
  projectId: "my-app-project-461822",
  storageBucket: "my-app-project-461822.firebasestorage.app",
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
