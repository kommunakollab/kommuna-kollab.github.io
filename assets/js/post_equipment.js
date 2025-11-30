// assets/js/post_equipment.js
import { auth, db } from "../assets/js/firebase.js";
import { uploadFile } from "../assets/js/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const ownerNameEl = document.getElementById("ownerName");
const categoryEl = document.getElementById("category");
const titleEl = document.getElementById("title");
const descEl = document.getElementById("description");
const priceEl = document.getElementById("price");
const photoEl = document.getElementById("photo");
const idEl = document.getElementById("idUpload");
const saveBtn = document.getElementById("saveListing");
const uploadIdBtn = document.getElementById("uploadIdBtn");
const status = document.getElementById("status");

let currentUser = null;
onAuthStateChanged(auth, (u) => {
  currentUser = u;
  if (u) {
    ownerNameEl.value = u.displayName || ownerNameEl.value;
  }
});

// Save listing (requires login)
saveBtn.addEventListener("click", async () => {
  if (!currentUser) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }
  const ownerName = ownerNameEl.value.trim() || currentUser.displayName || "Unknown";
  const category = categoryEl.value;
  const title = titleEl.value.trim();
  const description = descEl.value.trim();
  const price = Number(priceEl.value) || 0;
  const photoFile = photoEl.files[0];
  const idFile = idEl.files[0];

  if (!title) return alert("Please add a title.");
  if (!photoFile) return alert("Please add a photo of the equipment.");

  try {
    status.textContent = "Uploading image...";

    // upload equipment photo
    const photoPath = `goods/${currentUser.uid}/${Date.now()}_photo.jpg`;
    const photoURL = await uploadFile(photoPath, photoFile);

    let idURL = null;
    if (idFile) {
      status.textContent = "Uploading ID...";
      const idPath = `goods/${currentUser.uid}/${Date.now()}_id`;
      idURL = await uploadFile(idPath, idFile);
    }

    // create goods doc
    status.textContent = "Saving listing...";
    await addDoc(collection(db, "goods"), {
      ownerId: currentUser.uid,
      ownerEmail: currentUser.email,
      ownerName,
      category,
      title,
      description,
      price,
      currency: "₱",
      photo: photoURL,
      idVerification: idURL || null,
      verified: idURL ? false : false,
      createdAt: serverTimestamp()
    });

    status.textContent = "Listing saved ✔️";
    alert("Listing saved successfully!");
    window.location.href = "goods.html";

  } catch (err) {
    console.error(err);
    alert("Error saving listing: " + err.message);
    status.textContent = "";
  }
});

// Upload ID only (for users who posted earlier)
uploadIdBtn.addEventListener("click", async () => {
  if (!currentUser) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }
  const idFile = idEl.files[0];
  if (!idFile) return alert("Choose an ID file first.");

  try {
    status.textContent = "Uploading ID...";
    const idPath = `goods/${currentUser.uid}/${Date.now()}_id`;
    const idURL = await uploadFile(idPath, idFile);

    // find user's goods docs and attach idVerification to latest (simple approach)
    const { query, collection, where, orderBy, limit, getDocs, doc, updateDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    const q = query(collection(db, "goods"), where("ownerId", "==", currentUser.uid), orderBy("createdAt", "desc"), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) {
      alert("No listing found to attach ID to. Please create a listing first.");
      status.textContent = "";
      return;
    }
    const gdoc = snap.docs[0];
    await updateDoc(doc(db, "goods", gdoc.id), { idVerification: idURL, verified: false });

    alert("ID uploaded and attached to your latest listing. Admin will verify soon.");
    status.textContent = "ID uploaded ✔️";
  } catch (err) {
    console.error(err);
    alert("Error uploading ID: " + err.message);
    status.textContent = "";
  }
});
