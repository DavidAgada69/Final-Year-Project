// Import the functions from firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase project config from firebase project
const firebaseConfig = {
    apiKey: "AIzaSyCkdnxwPDz9EpquPiPTQTPk_L5iZi4dHFA",
    authDomain: "dnet-builders.firebaseapp.com",
    projectId: "dnet-builders",
    storageBucket: "dnet-builders.firebasestorage.app",
    messagingSenderId: "664593264046",
    appId: "1:664593264046:web:258252b1f7b634ac0b6c3f"
};

// Initialize firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);