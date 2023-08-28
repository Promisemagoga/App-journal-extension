// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import{getFirestore} from "firebase/firestore"
import{getStorage} from "firebase/storage";
import {getAuth, onAuthStateChanged} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyBmb2s9p-XO4pJE1QBr5FrTxm7ov8LFtio",
  authDomain: "journal-app-69873.firebaseapp.com",
  projectId: "journal-app-69873",
  storageBucket: "journal-app-69873.appspot.com",
  messagingSenderId: "976376874943",
  appId: "1:976376874943:web:e323f56b52bf24d232030a",
  measurementId: "G-0X3XR2W3JG"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage,auth}

