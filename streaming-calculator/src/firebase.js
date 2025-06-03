// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);