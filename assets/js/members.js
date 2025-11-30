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
const db = firebase.firestore();

const membersList = document.getElementById("membersList");

db.collection("members")
  .orderBy("joinedAt", "desc")
  .onSnapshot((snap) => {
    membersList.innerHTML = "";

    snap.forEach((doc) => {
      const d = doc.data();

      let badge = "";
      if (d.admin) badge = `<span class="text-yellow-400 text-xl">⭐</span>`;
      else if (d.premium) badge = `<span class="text-red-400 text-xl">❤️</span>`;

      const portfolio = d.portfolioUrl
        ? `<a href="${d.portfolioUrl}" 
             class="text-blue-400 underline" target="_blank">View Portfolio</a>`
        : `<span class="text-gray-500">No portfolio</span>`;

      membersList.innerHTML += `
        <div class="bg-white/10 p-6 rounded-2xl border border-white/20 text-center">

          <img src="${d.photo || 'assets/img/defaultpfp.png'}"
               class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">

          <p class="text-gray-300 text-sm mb-1">
            ${d.university || "No university provided"}
          </p>

          <h3 class="text-xl font-semibold flex justify-center items-center gap-2">
            ${d.name} ${badge}
          </h3>

          <p class="text-gray-300 text-sm">${d.email}</p>

          <div class="mt-3">${portfolio}</div>
        </div>
      `;
    });
  });
