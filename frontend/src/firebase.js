// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "poll-nation-web.firebaseapp.com",
  projectId: "poll-nation-web",
  storageBucket: "poll-nation-web.firebasestorage.app",
  messagingSenderId: "872845504988",
  appId: "1:872845504988:web:e744da201e9be08cecdf19",
  measurementId: "G-Y5440C2HCP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);