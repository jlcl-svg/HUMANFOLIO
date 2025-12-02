import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Helper para acessar variáveis de ambiente de forma segura no Vite
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore - Vite define import.meta.env
    return import.meta.env[key] || "";
  } catch (e) {
    return "";
  }
};

const firebaseConfig = {
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY"),
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("VITE_FIREBASE_APP_ID"),
};

// Inicializa o Firebase
// Nota: Se as chaves estiverem vazias (ex: durante build ou preview sem .env), 
// o initializeApp pode lançar warning, mas evita crash total da página branca.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
