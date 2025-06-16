import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// If you use other Firebase services like Firestore, Storage, or Analytics,
// make sure to import and initialize them here as well.
// Example:
// import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCIR4WJthrMjy6SH4CkHc7PHcKwHYFSSQU",
  authDomain: "my-app-project-461822.firebaseapp.com",
  projectId: "my-app-project-461822",
  storageBucket: "my-app-project-461822.firebasestorage.app",
  messagingSenderId: "679820915121",
  appId: "1:679820915121:web:ff68938b52ab90d1fc4d90"
  // measurementId: "YOUR_MEASUREMENT_ID" // Optional, for Google Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
// export const db = getFirestore(app); // Uncomment if you use Firestore
// export const analytics = getAnalytics(app); // Uncomment if you use Analytics

// Export the Firebase app instance if needed elsewhere
export default app;
