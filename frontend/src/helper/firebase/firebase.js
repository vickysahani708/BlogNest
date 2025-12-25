// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { initializeApp } from "firebase/app";

import { getenv } from "../getenv";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getenv('VITE_FIREBASE_API'),
  authDomain: "nest-blog-a58cb.firebaseapp.com",
  projectId: "nest-blog-a58cb",
  storageBucket: "nest-blog-a58cb.firebasestorage.app",
  messagingSenderId: "895817922461",
  appId: "1:895817922461:web:d72b83d3789a93f2e22174",
  measurementId: "G-XHBKMYH7C0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Add custom parameters to improve popup behavior
provider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, provider }