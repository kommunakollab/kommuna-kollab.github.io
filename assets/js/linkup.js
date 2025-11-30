// assets/js/linkup.js
// Non-modular Firebase usage (keeps style consistent with your members.js)
(function () {
  if (!window.firebase) {
    console.error("Firebase not loaded - make sure to include firebase scripts before linkup.js");
    return;
  }

  // Init (uses same config you used elsewhere)
  const firebaseConfig = {
    apiKey: "AIzaSyCW54uiSqmP0_ruZnp7MGBAtp6v3G9XD4A",
    authDomain: "kommunakollab.firebaseapp.com",
    projectId: "kommunakollab",
    storageBucket: "kommunakollab.firebasestorage.app",
    messagingSenderId: "804121046636",
    appId: "1:804121046636:web:7bfb3e6a0cd48f0eea7249",
    measurementId: "G-XWT64NGD03"
  };

  // if firebase not initialized yet, initialize
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  } catch (err) {
    console.warn("firebase.initializeApp error (may be already initialized):", err);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  const grid = document.getElementById("linkupGrid");
  if (!grid) {
    console.error("linkupGrid element not found");
    return;
  }

  // Render a locked card (used if user isn't premium)
  function renderLocked() {
    grid.innerHTML = `
      <div class="bg-white/10 p-6 rounded-2xl border border-white/20 text-center backdrop-blur-md">
        <div class="w-24 h-24 mx-auto rounded-full bg-black/40 flex items-center justify-center text-4xl">
          🔒
        </div>
        <h3 class="text-xl font-semibold mt-4">Premium Required</h3>
        <p class="text-gray-400 mt-2 text-sm">
          Only premium members can view profiles.
        </p>

        <a href="premium.html"
           class="inline-block mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300">
          Become Premium
        </a>
      </div>
    `;
  }

  // Render message prompting sign-in
  function renderSignInPrompt() {
    grid.innerHTML = `
      <div class="bg-white/10 p-6 rounded-2xl border border-white/20 text-center backdrop-blur-md">
        <div class="text-5xl mb-4">🔒</div>
        <p class="text-gray-300 mb-4">Please sign in with Google to view premium members.</p>
        <a href="login.html" class="inline-block px-4 py-2 bg-white text-black rounded">Sign in / Join</a>
      </div>
    `;
  }

  // When auth state changes, check premium status and either render premium members or show locked card
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      // Not logged in: show lock + sign-in prompt
      renderSignInPrompt();
      return;
    }

    try {
      const userDoc = await db.collection("members").doc(user.uid).get();
      const data = userDoc.exists ? userDoc.data() : null;

      if (!data || !data.premium) {
        // Not premium
        renderLocked();
        return;
      }

      // User is premium: subscribe to premium members only
      db.collection("members")
        .where("premium", "==", true)
        .orderBy("joinedAt", "desc")
        .onSnapshot((snap) => {
          grid.innerHTML = "";

          if (snap.empty) {
            grid.innerHTML = `<p class="text-gray-300">No premium members yet.</p>`;
            return;
          }

          snap.forEach((doc) => {
            const d = doc.data();
            const photo = d.photo || 'assets/img/defaultpfp.png';
            const portfolio = d.portfolioUrl
              ? `<a href="${d.portfolioUrl}" target="_blank" class="text-blue-400 underline">View Portfolio</a>`
              : `<span class="text-gray-500">No portfolio</span>`;

            const badge = d.admin ? `<span class="text-yellow-400 text-xl">⭐</span>`
                        : d.premium ? `<span class="text-yellow-300 text-xl">❤️</span>` : "";

            grid.innerHTML += `
              <div class="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md">
                <img src="${photo}" class="w-24 h-24 mx-auto rounded-full mb-4 object-cover">
                <h3 class="text-xl font-semibold mt-2 text-center">${d.name || 'Unknown'} ${badge}</h3>
                <p class="text-gray-400 text-center mb-4">${d.email || ''}</p>
                <div class="text-center">${portfolio}</div>
              </div>
            `;
          });
        });

    } catch (err) {
      console.error("Error checking premium status:", err);
      grid.innerHTML = `<p class="text-red-400">Error loading premium members.</p>`;
    }
  });

})();
