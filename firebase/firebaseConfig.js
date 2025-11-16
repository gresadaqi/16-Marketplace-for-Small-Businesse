// firebase/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCILbK_ALjAbuEf8ZMOUcKoAj7mZ7WueXE",
  authDomain: "taskmanagerapp-19517.firebaseapp.com",
  projectId: "taskmanagerapp-19517",
  storageBucket: "taskmanagerapp-19517.firebasestorage.app",  messagingSenderId: "600402093037",
  appId: "1:600402093037:web:7dbcde00a12783f856fde4",
  measurementId: "G-TEEPYP0ZMW",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
