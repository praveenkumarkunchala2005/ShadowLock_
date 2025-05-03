import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCbfxN0EJHh3gy3I9icTOc0UB0SVYZleoE",
  authDomain: "shadowlock-68919.firebaseapp.com",
  projectId: "shadowlock-68919",
  storageBucket: "shadowlock-68919.firebasestorage.app",
  messagingSenderId: "885271753081",
  appId: "1:885271753081:web:2d5c53ba83167b53f8bfa8",
  measurementId: "G-MPV9YRCD71"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const rtdb = getDatabase(app);

export { db, rtdb, collection, onSnapshot, ref, onValue };
