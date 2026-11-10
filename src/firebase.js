import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBb6nQ7UPQxXcWEGY7BtfD529wRSl2bIM0",
  authDomain: "bdjuguetes-b5829.firebaseapp.com",
  projectId: "bdjuguetes-b5829",
  storageBucket: "bdjuguetes-b5829.firebasestorage.app",
  messagingSenderId: "1032305382769",
  appId: "1:1032305382769:web:324caad0e99c1f1a8452d0",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
