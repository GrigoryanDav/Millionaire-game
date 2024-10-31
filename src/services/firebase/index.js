import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA-E-Qad0pgSgFUuMq9oybijK48KaKSaIc",
  authDomain: "millionaire-4e00d.firebaseapp.com",
  projectId: "millionaire-4e00d",
  storageBucket: "millionaire-4e00d.appspot.com",
  messagingSenderId: "1072313340977",
  appId: "1:1072313340977:web:9a80786d48326113067110"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {
    auth
}