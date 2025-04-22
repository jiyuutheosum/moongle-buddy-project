// contains firebase config

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// secret config
// import { firebaseSecret } from "@/secret";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ7-_HqitEZBRNT3a5P95YqKUSzWhRFAs",
  authDomain: "moongle-buddy.firebaseapp.com",
  projectId: "moongle-buddy",
  storageBucket: "moongle-buddy.firebasestorage.app",
  messagingSenderId: "756178203827",
  appId: "1:756178203827:web:03a4c1d21433de0b242cc6",
  measurementId: "G-RWE3CKX635",

  // secret configs
  // apiKey: firebaseSecret.API_KEY,
  // authDomain: firebaseSecret.AUTH_DOMAIN,
  // projectId: firebaseSecret.PROJECT_ID,
  // storageBucket: firebaseSecret.STORAGE_BUCKET,
  // messagingSenderId: firebaseSecret.MESSAGING_SENDER_ID,
  // appId: firebaseSecret.APP_ID,
  // measurementId: firebaseSecret.MEASUREMENT_ID,
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_DB = getFirestore(FIREBASE_APP);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// const analytics = getAnalytics(app);

if (FIREBASE_APP && FIREBASE_DB && FIREBASE_AUTH) {
  console.log("firebase app, firestore, and auth are initialized!");
}

export { FIREBASE_APP, FIREBASE_DB, FIREBASE_AUTH };
