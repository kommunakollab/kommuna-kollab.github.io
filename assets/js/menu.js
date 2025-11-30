// assets/js/menu.js

const menu = document.getElementById('slideMenu');
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const body = document.body;

// --- OPEN MENU ---
function openMenu() {
  menu.classList.remove("translate-x-full");
  body.classList.add("no-scroll");
}

// --- CLOSE MENU ---
function closeMenu() {
  menu.classList.add("translate-x-full");
  body.classList.remove("no-scroll");
}

// --- Attach Events ---
menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);

// --- Handle navigation ---
menu.querySelectorAll('[data-route]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const route = a.getAttribute('data-route');

    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { route } })
    );

    closeMenu();
  });
});

export { openMenu, closeMenu };
