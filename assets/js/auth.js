// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyCW54uiSqmP0_ruZnp7MGBAtp6v3G9XD4A",
  authDomain: "kommunakollab.firebaseapp.com",
  projectId: "kommunakollab",
  storageBucket: "kommunakollab.firebasestorage.app",
  messagingSenderId: "804121046636",
  appId: "1:804121046636:web:7bfb3e6a0cd48f0eea7249",
  measurementId: "G-XWT64NGD03"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Google Login
document.getElementById("googleLoginBtn")?.addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    // Save user to Firestore
    await db.collection("members").doc(user.uid).set({
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      premium: false,   // default
      admin: false,     // default
      portfolioUrl: null,
      joinedAt: new Date()
    }, { merge: true });

    alert("Login successful!");
    window.location.href = "members.html";

  } catch (error) {
    console.error(error);
    alert("Login failed.");
  }
});
