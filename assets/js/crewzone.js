/* ============================
   FIREBASE SETUP
============================= */
const firebaseConfig = {
  apiKey: "AIzaSyCW54uiSqmP0_ruZnp7MGBAtp6v3G9XD4A",
  authDomain: "kommunakollab.firebaseapp.com",
  projectId: "kommunakollab",
  storageBucket: "kommunakollab.appspot.com",
  messagingSenderId: "804121046636",
  appId: "1:804121046636:web:7bfb3e6a0cd48f0eea7249",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/* ============================
   DOM ELEMENTS
============================= */
const postFeed = document.getElementById("postFeed");
const postBtn = document.getElementById("postBtn");
const postInput = document.getElementById("postInput");

let currentUser = null;

/* ============================
   AUTH CHECK
============================= */
// auth.onAuthStateChanged(user => {
//   if (!user) {
//     alert("Please log in to continue.");
//     location.href = "login.html";
//     return;
//   }
//   currentUser = user;
// });

/* Masked name like Cl**r*N***a */
function hideName(name) {
  if (!name) return "Anonymous";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
}

/* ============================
   POST BUTTON
============================= */
postBtn.addEventListener("click", async () => {
  if (!postInput.value.trim()) return alert("Please type something.");

  const user = auth.currentUser;

  await db.collection("forum").add({
    uid: user.uid,
    avatar: user.photoURL || "assets/img/defaultpfp.png",
    name: hideName(user.displayName || "User"),
    text: postInput.value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  postInput.value = "";
});

/* ============================
   REAL + STATIC POSTS
============================= */
db.collection("forum")
  .orderBy("createdAt", "desc")
  .onSnapshot(snap => {
    postFeed.innerHTML = "";

    // REAL POSTS
    if (!snap.empty) {
      snap.forEach(doc => {
        const p = doc.data();
        postFeed.innerHTML += `
          <div class="bg-black/60 p-5 rounded-xl border border-white/10">
            <div class="flex items-center gap-3 mb-3">
              <img src="${p.avatar}" class="w-12 h-12 rounded-full object-cover border">
              <div class="font-semibold">${p.name}</div>
            </div>
            <p class="text-gray-200">${p.text}</p>
          </div>
        `;
      });
    }

    /* STATIC SAMPLE POSTS */
    const staticPosts = [
      { name:"Cl**r*N***a", text:"Nakakapagod talaga mag-prod men… pero sobrang fulfilling!", avatar:"assets/img/anon1.png" },
      { name:"Jo*n M***o", text:"Sana mas madami pang collab opportunities!", avatar:"assets/img/anon1.png" },
      { name:"Al***h", text:"Ang ganda ng community vibes dito.", avatar:"assets/img/anon1.png" },
      { name:"R***el", text:"First time ko sumali. Ang welcoming lahat!", avatar:"assets/img/anon1.png" },
      { name:"Kr**", text:"Looking for photographers to collab!", avatar:"assets/img/anon1.png" }
    ];

    staticPosts.forEach(p => {
      postFeed.innerHTML += `
        <div class="bg-black/60 p-5 rounded-xl border border-white/10">
          <div class="flex items-center gap-3 mb-3">
            <img src="${p.avatar}" class="w-12 h-12 rounded-full object-cover border">
            <div class="font-semibold">${p.name}</div>
          </div>
          <p class="text-gray-200">${p.text}</p>
        </div>
      `;
    });

    /* FACEBOOK-STYLE ANONYMOUS BLOCK */
    const anonBlock = [
      { name:"Anonymous member 804", text:"███████████████████████████", avatar:"assets/img/anon1.png" },
      { name:"Anonymous member", text:"███████████████████████", avatar:"assets/img/anon2.png" },
      { name:"Anonymous member 129", text:"███████████████████", avatar:"assets/img/anon1.png" },
      { name:"Anonymous member 452", text:"██████████████████████", avatar:"assets/img/anon2.png" }
    ];

    anonBlock.forEach(a => {
      postFeed.innerHTML += `
        <div class="bg-black/40 p-5 rounded-xl border border-white/10">
          <div class="flex items-center gap-3 mb-3">
            <img src="${a.avatar}" class="w-10 h-10 rounded-full object-cover border border-white/30">
            <div class="font-semibold text-white">${a.name}</div>
          </div>

          <div class="bg-white text-black p-3 rounded-lg shadow-md mb-3 max-w-[90%] ml-12">
            ${a.text}
          </div>

          <div class="flex items-center gap-6 text-sm text-gray-300 ml-16">
            <button class="hover:text-yellow-300">Like</button>
            <button class="hover:text-yellow-300">Reply</button>
          </div>
        </div>
      `;
    });

  });
