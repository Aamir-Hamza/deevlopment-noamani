import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMvpoDtjtcxHS_9ZKefjjmE9cNWQsiHjk",
  authDomain: "noamani-otp.firebaseapp.com",
  projectId: "noamani-otp",
  storageBucket: "noamani-otp.firebasestorage.app",
  messagingSenderId: "468283420533",
  appId: "1:468283420533:web:2c8c494327e2f00acced3c",
  measurementId: "G-58XE4GFJVX"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier };
