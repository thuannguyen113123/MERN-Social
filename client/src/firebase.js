// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtGuFKy8ssyyjYvLp6hMkN4K2kMCKU6XQ",
  // apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "mern-booking-app-3f925.firebaseapp.com",
  projectId: "mern-booking-app-3f925",
  storageBucket: "mern-booking-app-3f925.appspot.com",
  messagingSenderId: "424560835528",
  appId: "1:424560835528:web:f23d2f618c0614618d1efd",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
