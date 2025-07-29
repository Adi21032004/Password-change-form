import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyB4vf2CSmZUTwhAdEHZvmAsQRfNWmYKifs",
authDomain: "password-change-form.firebaseapp.com",
projectId: "password-change-form",
storageBucket: "password-change-form.firebasestorage.app",
messagingSenderId: "314562434978",
appId: "1:314562434978:web:df659d87e8b22613d7c4fb",
measurementId: "G-GFT5QF83CT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };