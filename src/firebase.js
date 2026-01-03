import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAcco20FEbMPGad7p5xHvmPom0ws39QD8Q",
  authDomain: "love-space-ec934.firebaseapp.com",
  databaseURL: "https://love-space-ec934-default-rtdb.firebaseio.com",
  projectId: "love-space-ec934",
  storageBucket: "love-space-ec934.firebasestorage.app",
  messagingSenderId: "9687691018",
  appId: "1:9687691018:web:e686cc11613becb75094f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// On crée et on exporte la connexion
export const db = getDatabase(app);
