// Firebase config — PortfolioCraft
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBEG24922psKqeV8eDK0dJEoiDLGbWn11E",
  authDomain: "portfolio-builder-34379.firebaseapp.com",
  projectId: "portfolio-builder-34379",
  storageBucket: "portfolio-builder-34379.firebasestorage.app",
  messagingSenderId: "151727358507",
  appId: "1:151727358507:web:29c8d1f57fbe9d0bf2e06e",
  measurementId: "G-4MY7R3JSMX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Analytics — only in browser environments (Vercel SSR safe)
isSupported().then(yes => { if (yes) getAnalytics(app); });
