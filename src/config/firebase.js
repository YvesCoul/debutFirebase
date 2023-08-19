import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpsTzBSMq-f_Kab5onyIe-ymxWrxFxUZ0",
  authDomain: "debutfirebase-4a31d.firebaseapp.com",
  projectId: "debutfirebase-4a31d",
  storageBucket: "debutfirebase-4a31d.appspot.com",
  messagingSenderId: "870226766408",
  appId: "1:870226766408:web:272d1186163b398d24467d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
