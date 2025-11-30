// ----------------------------------------------------
// IMPORTS
// ----------------------------------------------------
import {
  auth,
  db,
  storage,
  uploadFile
} from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUID = null;
let existingPhoto = null;

// ----------------------------------------------------
// LOAD USER DATA
// ----------------------------------------------------
onAuthStateChanged(auth, async (user) => {
  if (!user) return alert("Please login first.");

  currentUID = user.uid;

  const ref = doc(db, "members", currentUID);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Create first time
    await setDoc(ref, {
      name: user.displayName || "",
      email: user.email || "",
      university: "",
      photo: "",
      portfolioUrl: "",
      premium: false,
      admin: false,
      joinedAt: serverTimestamp()
    });
  }

  const data = (await getDoc(ref)).data();

  // Fill fields
  document.getElementById("nameField").value = data.name;
  document.getElementById("emailField").value = data.email;
  document.getElementById("universityField").value = data.university || "";

  if (data.photo) {
    existingPhoto = data.photo;
    document.getElementById("profilePreview").src = data.photo;
  }
});

// ----------------------------------------------------
// HEIC → JPG CONVERSION
// ----------------------------------------------------
async function convertHEIC(file) {
  if (!file.name.toLowerCase().endsWith(".heic")) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          resolve(new File([blob], "converted.jpg", { type: "image/jpeg" }));
        }, "image/jpeg");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ----------------------------------------------------
// PREVIEW
// ----------------------------------------------------
document.getElementById("profilePic").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    document.getElementById("profilePreview").src = URL.createObjectURL(file);
  }
});

/// ------------------------
// SAVE PROFILE BUTTON
// ------------------------
document.getElementById("saveBtn").addEventListener("click", async () => {
  try {
    const name = document.getElementById("nameField").value;
    const email = document.getElementById("emailField").value;
    const university = document.getElementById("universityField").value;

    const profilePic = document.getElementById("profilePic").files[0];
    const portfolioFile = document.getElementById("portfolioFile").files[0];

    let photoURL = currentPhotoURL;
    let portfolioURL = null;

    // Upload profile pic
    if (profilePic) {
      const path = `profiles/${currentUID}/avatar_${Date.now()}.jpg`;
      photoURL = await uploadFile(path, profilePic);
    }

    // Upload PDF
    if (portfolioFile) {
      const pdfPath = `portfolios/${currentUID}/portfolio_${Date.now()}.pdf`;
      portfolioURL = await uploadFile(pdfPath, portfolioFile);
    }

    // ⭐ SAVE TO ➜ members (THIS IS WHAT FIXES YOUR ISSUE)
    await updateDoc(doc(db, "members", currentUID), {
      name,
      email,
      university,
      photo: photoURL,
      portfolioUrl: portfolioURL || null,
      updatedAt: new Date()
    });

    alert(`Profile saved, ${name}!`);
    window.location.href = "index.html";

  } catch (err) {
    alert("Error saving profile: " + err.message);
  }
});


