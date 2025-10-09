import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // ✅ Add this for Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKN-2-1BM_Nkib1Hf62v9ARapH0RIeSVk",
  authDomain: "student-teacher-portal-90b57.firebaseapp.com",
  projectId: "student-teacher-portal-90b57",
  storageBucket: "student-teacher-portal-90b57.firebasestorage.app",
  messagingSenderId: "852910882083",
  appId: "1:852910882083:web:91710a26879e69d540a096"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(app);
const firestore = firebase.firestore(app); // ✅ Correct way for compat

const firebaseSDK = { app, auth, firestore };

export default firebaseSDK;
