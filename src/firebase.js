import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // <-- J'ai ajouté cette ligne

const firebaseConfig = {
  apiKey: "AIzaSyAcco20FEbMPGad7p5xHvmPom0ws39QD8Q",
  authDomain: "love-space-ec934.firebaseapp.com",
  databaseURL: "https://love-space-ec934-default-rtdb.firebaseio.com",
  projectId: "love-space-ec934",
  storageBucket: "love-space-ec934.firebasestorage.app",
  messagingSenderId: "9687691018",
  appId: "1:9687691018:web:e686cc11613becb75094f3"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Exporte la base de données pour l'utiliser dans tes pages
export const db = getDatabase(app); // <-- J'ai ajouté cette ligne importante