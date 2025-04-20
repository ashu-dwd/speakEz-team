

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
const firebaseConfig = {
  apiKey: "AIzaSyCTZyz1T5uT80y8UpY0w8INUME2_S0SKpo",
  authDomain: "speakez-c0a61.firebaseapp.com",
  projectId: "speakez-c0a61",
  storageBucket: "speakez-c0a61.firebasestorage.app",
  messagingSenderId: "507411954952",
  appId: "1:507411954952:web:60772b55ed296b6e8740bd",
  measurementId: "G-RET0SQRPJC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
