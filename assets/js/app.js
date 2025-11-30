// assets/js/app.js
// Simple SPA router + minimal auth prototype (localStorage)
const app = document.getElementById('app'); // main container (holds sections)
const userKey = 'kk_demo_user';

// update UI auth (menu show/hide)
function updateAuthUI() {
  const loggedIn = !!localStorage.getItem(userKey);
  const menuLogout = document.getElementById('menuLogout');
  const menuLogin = document.getElementById('menuLogin');
  if (loggedIn) {
    menuLogout.classList.remove('hidden');
    menuLogin.classList.add('hidden');
  } else {
    menuLogout.classList.add('hidden');
    menuLogin.classList.remove('hidden');
  }
}

// navigate to route (either show a section or simulate page load)
function navigateTo(route) {
  // simple mapping: if an element with id exists, scroll to it and show
  const section = document.getElementById(route);
  if (section) {
    // show only that section and scroll there
    // For this prototype we will reveal that section and keep others hidden if wanted.
    // Simple approach: scroll to the section with smooth behavior
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // optionally highlight active nav link
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('text-blue-400'));
    document.querySelectorAll(`.nav-link[data-route="${route}"]`).forEach(a => a.classList.add('text-blue-400'));
    return;
  }

  // fallback: hash change style
  window.location.hash = route;
}

// listen to custom events from menu
window.addEventListener('navigate', e => {
  const route = e.detail.route;
  navigateTo(route);
});

// open login modal event (menu triggers)
window.addEventListener('open-login', () => {
  openLoginModal();
});

// logout event
window.addEventListener('logout', () => {
  localStorage.removeItem(userKey);
  updateAuthUI();
  alert('Logged out (prototype).');
});

// simple login modal (lightweight)
// We'll create a very small modal here to not require extra HTML files.
// If a more complex modal is desired, you can add a full login page.
function openLoginModal() {
  // create modal DOM
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-70 flex items-center justify-center bg-black/70';
  modal.innerHTML = `
    <div class="bg-black p-6 rounded max-w-md w-full text-white">
      <h3 class="text-lg font-semibold mb-3">Sign in (prototype)</h3>
      <input id="loginInput" class="w-full p-3 mb-3 bg-black/30 rounded border" placeholder="username">
      <div class="flex gap-3">
        <button id="modalLoginBtn" class="px-4 py-2 bg-white text-black rounded">Sign in</button>
        <button id="modalCancelBtn" class="px-4 py-2 border rounded">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('modalCancelBtn').addEventListener('click', () => modal.remove());
  document.getElementById('modalLoginBtn').addEventListener('click', () => {
    const val = document.getElementById('loginInput').value.trim();
    if (!val) { alert('Enter a username'); return; }
    localStorage.setItem(userKey, JSON.stringify({ username: val }));
    updateAuthUI();
    modal.remove();
    alert('Signed in as ' + val + ' (prototype)');
  });
}

// attach router to nav links in top nav too
document.querySelectorAll('[data-route]').forEach(a => {
  a.addEventListener('click', (e) => {
    const route = a.getAttribute('data-route');
    // if top nav clicked we want to close menu if open (menu module handles its own close)
    navigateTo(route);
    e.preventDefault();
  });
});

// hide/show navbar on scroll (small behavior)
let lastScroll = 0;
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const y = window.pageYOffset;
  nav.style.transform = (y > lastScroll && y > 100) ? 'translateY(-100%)' : 'translateY(0)';
  lastScroll = y;
});

// init
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
});
