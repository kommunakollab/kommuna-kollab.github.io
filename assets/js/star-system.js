import { db } from "./firebase.js";
import { 
  doc, getDoc, setDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ⭐ Creates user doc if missing and adds a star */
export async function addStar(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  let stars = 0;
  let free = false;

  // Auto-create missing user doc
  if (!snap.exists()) {
    await setDoc(ref, { stars: 0, freeRentAvailable: false });
  } else {
    stars = snap.data().stars || 0;
    free = snap.data().freeRentAvailable || false;
  }

  stars++;

  if (stars >= 5) {
    stars = 0;
    free = true;
    alert("🎉 You unlocked FREE RENT!");
  }

  await setDoc(
    ref,
    { stars: stars, freeRentAvailable: free },
    { merge: true }
  );

  console.log("⭐ Stars updated:", stars);
}

/* ⭐ Loads and displays user stars in HTML */
export async function loadUserStars(uid, displayEl, progressEl = null) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  let stars = 0;
  let free = false;

  if (snap.exists()) {
    stars = snap.data().stars || 0;
    free = snap.data().freeRentAvailable || false;
  }

  // Update "Stars: X"
  if (displayEl) displayEl.innerText = `Stars: ${stars}`;

  // Draw progress bar
  if (progressEl) {
    if (free) {
      progressEl.innerHTML =
        `<span class="text-green-400 font-bold">FREE RENT AVAILABLE!</span>`;
    } else {
      let bar = "";
      for (let i = 0; i < 5; i++) bar += i < stars ? "★ " : "☆ ";
      progressEl.innerHTML = `<span class="text-yellow-300">${bar} (${stars}/5)</span>`;
    }
  }
}
