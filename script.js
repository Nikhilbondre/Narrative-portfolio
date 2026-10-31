const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navlinks');
menuButton?.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.textContent = opened ? 'CLOSE ×' : 'MENU ☰';
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'MENU ☰';
}));

const genjoVideo = document.querySelector('#genjo-ambient-video');
const genjoVideoToggle = document.querySelector('#toggle-genjo-video');
genjoVideoToggle?.addEventListener('click', async () => {
  if (!genjoVideo) return;
  if (genjoVideo.paused) {
    try { await genjoVideo.play(); genjoVideoToggle.textContent = 'PAUSE MOTION Ⅱ'; }
    catch { genjoVideoToggle.textContent = 'PLAY MOTION ▶'; }
  } else {
    genjoVideo.pause();
    genjoVideoToggle.textContent = 'PLAY MOTION ▶';
  }
});
