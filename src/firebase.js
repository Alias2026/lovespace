import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcco20FEbMPGad7p5xHvmPom0ws39QD8Q",
  authDomain: "love-space-ec934.firebaseapp.com",
  databaseURL: "https://love-space-ec934-default-rtdb.firebaseio.com",
  projectId: "love-space-ec934",
  storageBucket: "love-space-ec934.firebasestorage.app",
  messagingSenderId: "9687691018",
  appId: "1:9687691018:web:e686cc11613becb75094f3"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

const auth = getAuth(app);

// 🔐 Connexion anonyme
signInAnonymously(auth);

// ✅ ON ATTEND la connexion
export const waitForAuth = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback();
    }
  });
};
