import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6YxMT8V-eTu76GbmD2bMaX8xswxigjh8",
  authDomain: "dashboard-4bd74.firebaseapp.com",
  projectId: "dashboard-4bd74",
  storageBucket: "dashboard-4bd74.firebasestorage.app",
  messagingSenderId: "811394185124",
  appId: "1:811394185124:web:808462f5bdd8692e26b331",
  measurementId: "G-FWTVELB4JP"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
