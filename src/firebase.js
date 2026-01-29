import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcco20FEbMPGad7p5xHvmPom0ws39QD8Q",
  authDomain: "love-space-ec934.firebaseapp.com",
  databaseURL: "https://love-space-ec934-default-rtdb.firebaseio.com",
  projectId: "love-space-ec934",
  storageBucket: "love-space-ec934.firebasestorage.app",
  messagingSenderId: "9687691018",
  appId: "1:9687691018:web:e686cc11613becb75094f3"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Database
export const db = getDatabase(app);

// Auth
const auth = getAuth(app);

// Connexion anonyme automatique
signInAnonymously(auth)
  .then(() => {
    console.log("✅ Connecté anonymement");
  })
  .catch((error) => {
    console.error("❌ Erreur auth :", error);
  });
