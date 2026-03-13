// ==============================
// FIREBASE SETUP
// ==============================

import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAQPf3RnpcH5WDNONz3zBUlSu-5PhftXgo",
  authDomain: "airesume-e3afa.firebaseapp.com",
  projectId: "airesume-e3afa",
  storageBucket: "airesume-e3afa.firebasestorage.app",
  messagingSenderId: "766576166121",
  appId: "1:766576166121:web:81cadff0d38fd5bf93dc78"
}

const app = initializeApp(firebaseConfig)

// ==============================
// EXPORT AUTH + GOOGLE + DB
// ==============================

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)