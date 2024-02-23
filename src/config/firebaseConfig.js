import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyASByHisF628tGERKa5Og6sY18j9LA_ugc",
  authDomain: "questionbank-d0788.firebaseapp.com",
  projectId: "questionbank-d0788",
  storageBucket: "questionbank-d0788.appspot.com",
  messagingSenderId: "715290109810",
  appId: "1:715290109810:web:0da69da285657aa3a31feb",
  measurementId: "G-6HWTKSWMXL",
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
