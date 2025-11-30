// -----------------------------
// Firebase Imports
// -----------------------------
import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


// -----------------------------
// Firebase Config
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCW54uiSqmP0_ruZnp7MGBAtp6v3G9XD4A",
  authDomain: "kommunakollab.firebaseapp.com",
  projectId: "kommunakollab",
  storageBucket: "kommunakollab.firebasestorage.app",
  messagingSenderId: "804121046636",
  appId: "1:804121046636:web:7bfb3e6a0cd48f0eea7249",
  measurementId: "G-XWT64NGD03"
};


// -----------------------------
// Firebase Init
// -----------------------------
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);


// -----------------------------
// Google Login + Auto-create Member
// -----------------------------
export async function loginGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const memRef = doc(db, "members", user.uid);

  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      university: "",
      photoURL: user.photoURL || "",
      portfolioPDF: null,
      admin: false,
      premium: false,
      joinedAt: serverTimestamp()
    });

    // also create members entry
    await setDoc(memRef, {
      name: user.displayName,
      email: user.email,
      university: "",
      photo: user.photoURL || "",
      portfolioUrl: "",
      premium: false,
      admin: false,
      joinedAt: serverTimestamp()
    });

    return { user, isNew: true };
  }

  return { user, isNew: false };
}




// -----------------------------
// Upload File Helper
// -----------------------------
export async function uploadFile(path, file) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}


/// -----------------------------
// Update Firestore (users + members)
// -----------------------------
export async function updateUserDoc(uid, data) {

  const userRef = doc(db, "users", uid);
  const memRef = doc(db, "members", uid);

  // Update users collection
  await updateDoc(userRef, data).catch(async () => {
    await setDoc(userRef, data); // create if missing
  });

  // Update members collection
  await updateDoc(memRef, {
    name: data.name || "",
    email: data.email || "",
    university: data.university || "",
    photo: data.photoURL || "",
    portfolioUrl: data.portfolioPDF || "",
    premium: data.premium ?? false,
    admin: data.admin ?? false,
    updatedAt: serverTimestamp()
  }).catch(async () => {
    await setDoc(memRef, {
      name: data.name || "",
      email: data.email || "",
      university: data.university || "",
      photo: data.photoURL || "",
      portfolioUrl: data.portfolioPDF || "",
      premium: false,
      admin: false,
      joinedAt: serverTimestamp()
    });
  });
}



// -----------------------------
// Logout
// -----------------------------
export async function logoutUser() {
  return await signOut(auth);
}
