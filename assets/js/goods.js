const goodsGrid = document.getElementById("goodsGrid");
const categorySelect = document.getElementById("categorySelect");

const items = [
  {
    title: "Gab",
    model: "Fender FA-345CE",
    description: "Brown frame with wooden highlights. Clean tone, great for acoustic sessions.",
    year: "2023 — Present",
    price: 500,
    img: "assets/img/Guitar%20for%20rent.jpg",   // FIXED
    category: "guitar"
  },
  {
    title: "Aira",
    model: "Jackson Electric",
    description: "Sharp black design, perfect for rock and metal sessions.",
    year: "2022 — Present",
    price: 650,
    img: "assets/img/Eguitar.jpg",               // This one is safe IF file name is exact
    category: "guitar"
  },
  {
    title: "Ken",
    model: "Pearl Drumset",
    description: "Full drum kit, great for studio recordings and rehearsals.",
    year: "2021 — Present",
    price: 900,
    img: "assets/img/drums.jpg",                 // Safe too
    category: "drums"
  }
];

function renderItems(list) {
  goodsGrid.innerHTML = "";
  list.forEach(item => {
    goodsGrid.innerHTML += `
      <div class="bg-white/10 p-4 rounded-xl border border-white/20">
        <img src="${item.img}" class="w-full h-44 object-cover rounded mb-3">
        <h2 class="text-xl font-semibold">${item.title}</h2>
        <p class="text-gray-300 text-sm">${item.category}</p>
        <button 
          class="mt-3 w-full bg-orange-600 text-black py-2 rounded" 
          onclick="openDetails('${encodeURIComponent(JSON.stringify(item))}')">
          View Details
        </button>
      </div>
    `;
  });
}

window.openDetails = function(itemJSON) {
  const item = JSON.parse(decodeURIComponent(itemJSON));
  const url = new URL("goods_details.html", window.location.href);

  for (let key in item) {
    url.searchParams.set(key, item[key]);
  }

  window.location.href = url.toString();
};

renderItems(items);
