// assets/js/firebase.js
// Paste your firebaseConfig values into the firebaseConfig object below.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut as fbSignOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ====== REPLACE THIS WITH YOUR FIREBASE CONFIG ======
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
===================================================== */

const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// helper login functions
async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  // result.user contains user object
  return result;
}

async function loginWithGithub() {
  const result = await signInWithPopup(auth, githubProvider);
  return result;
}

async function signOut() {
  return fbSignOut(auth);
}

export { app, auth, db, loginWithGoogle, loginWithGithub, signOut };
