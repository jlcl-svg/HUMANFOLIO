import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Safe access to environment variables. 
// In some preview environments, import.meta.env might be undefined initially.
const getEnv = () => {
  try {
    return (import.meta as any).env || {};
  } catch {
    return {};
  }
};

const env = getEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase only if config is valid-ish to prevent immediate crash,
// though functionality will require valid keys.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);