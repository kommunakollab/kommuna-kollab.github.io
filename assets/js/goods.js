const goodsGrid = document.getElementById("goodsGrid");

const items = [
  {
    title: "Aira",
    model: "Jackson V-Shape",
    description: "Sharp tone, great for rock sessions",
    year: "2022–Present",
    price: 700,
    img: "none"
  },
  {
    title: "Gab",
    model: "Fender FA-345CE",
    description: "Warm acoustic tone",
    year: "2023–Present",
    price: 500,
    img: "none"
  }
];

function renderItems() {
  goodsGrid.innerHTML = "";
  items.forEach(item => {
    goodsGrid.innerHTML += `
      <div class="bg-white/10 p-4 rounded-xl border border-white/20">
        <h2 class="text-xl font-semibold mb-2">${item.title}</h2>
        <button onclick="openDetails('${encodeURIComponent(JSON.stringify(item))}')"
          class="w-full bg-orange-600 p-2 rounded mt-2">
          View Details
        </button>
      </div>
    `;
  });
}

window.openDetails = function(itemJSON){
  const item = JSON.parse(decodeURIComponent(itemJSON));
  const url = new URL("goods_details.html", location.href);

  for (let key in item) url.searchParams.set(key, item[key]);

  location.href = url;
};

renderItems();
