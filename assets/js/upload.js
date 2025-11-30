const firebaseConfig = {
  apiKey: "AIzaSyCW54uiSqmP0_ruZnp7MGBAtp6v3G9XD4A",
  authDomain: "kommunakollab.firebaseapp.com",
  projectId: "kommunakollab",
  storageBucket: "kommunakollab.firebasestorage.app",
  messagingSenderId: "804121046636",
  appId: "1:804121046636:web:7bfb3e6a0cd48f0eea7249",
  measurementId: "G-XWT64NGD03"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const file = document.getElementById("pdfFile").files[0];

  if (!file) {
    alert("Please select a PDF file.");
    return;
  }

  const user = auth.currentUser;

  if (!user) {
    alert("You must log in first.");
    window.location.href = "login.html";
    return;
  }

  // Check premium
  const userDoc = await db.collection("members").doc(user.uid).get();
  if (!userDoc.exists || !userDoc.data().premium) {
    alert("Only premium members can upload a portfolio.");
    return;
  }

  const storageRef = storage.ref(`portfolios/${user.uid}.pdf`);
  await storageRef.put(file);

  const url = await storageRef.getDownloadURL();

  await db.collection("members").doc(user.uid).update({
    portfolioUrl: url
  });

  alert("Portfolio uploaded successfully!");

  window.location.href = "members.html";
});
