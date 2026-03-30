import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCbBWFKZbqEs-_kab4CJTo4KzPH4IyXcVw",
  authDomain: "tfgv2-c4f8a.firebaseapp.com",
  databaseURL: "https://tfgv2-c4f8a-default-rtdb.firebaseio.com",
  projectId: "tfgv2-c4f8a",
  storageBucket: "tfgv2-c4f8a.firebasestorage.app",
  messagingSenderId: "920962535341",
  appId: "1:920962535341:web:2f3627bc2e14e125f1db24",
  measurementId: "G-1NF1KNV6RB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);