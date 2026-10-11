'use strict';
const dialog = document.querySelector('#contact-dialog');
const form = document.querySelector('#brief-form');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
let returnFocus = null;

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
  mobileMenu.hidden = true;
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  mobileMenu.hidden = isOpen;
});

document.querySelectorAll('[data-contact]').forEach(button => {
  button.addEventListener('click', () => {
    returnFocus = button;
    closeMenu();
    form.hidden = false;
    document.querySelector('#brief-result').hidden = true;
    document.querySelector('#copy-status').textContent = '';
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});

document.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  if (returnFocus && returnFocus.offsetParent) returnFocus.focus();
  else menuToggle.focus();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('pointerdown', event => {
  if (!mobileMenu.hidden && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

form.addEventListener('submit', event => {
  event.preventDefault();
  const contact = form.elements.contact.value.trim();
  if (!contact) { form.elements.contact.focus(); return; }
  const task = form.elements.project.value.trim();
  const message = ['Даниил, здравствуйте! Хочу обсудить разработку сайта.', '', `Мой Telegram: ${contact}`, task ? `О проекте: ${task}` : '', '', 'Подскажите подходящий формат, стоимость и сроки.'].filter(Boolean).join('\n');
  document.querySelector('#brief-text').value = message;
  form.hidden = true;
  document.querySelector('#brief-result').hidden = false;
  document.querySelector('#copy-brief').focus();
});

document.querySelector('#copy-brief').addEventListener('click', async () => {
  const field = document.querySelector('#brief-text');
  const status = document.querySelector('#copy-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(field.value);
    status.textContent = 'Сообщение скопировано.';
  } catch {
    field.focus(); field.select();
    status.textContent = 'Текст выделен. Скопируйте его сочетанием Ctrl+C или ⌘C.';
  }
});


// Pin the video to the photograph, including object-fit cropping at every breakpoint.
const monitorVideo = document.querySelector('.monitor-video');
const monitorPlane = document.querySelector('.monitor-plane');
const heroVisual = document.querySelector('.hero__visual');
const heroPhoto = document.querySelector('.hero__photo');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let heroInView = true;
function alignMonitor() {
  const width = heroVisual.clientWidth, height = heroVisual.clientHeight;
  const style = getComputedStyle(heroPhoto);
  const position = style.objectPosition.split(' ').map(parseFloat);
  const scale = style.objectFit === 'contain' ? Math.min(width / 1584, height / 993) : Math.max(width / 1584, height / 993);
  const zoom = style.transform === 'none' ? 1 : new DOMMatrixReadOnly(style.transform).a;
  const x = (width - 1584 * scale) * position[0] / 100;
  const y = (height - 993 * scale) * position[1] / 100;
  monitorPlane.style.transform = `translate(${width / 2 * (1 - zoom) + x * zoom}px, ${height / 2 * (1 - zoom) + y * zoom}px) scale(${scale * zoom})`;
  monitorPlane.style.visibility = 'visible';
}
function updateMonitorPlayback() {
  if (reducedMotion.matches || document.hidden || !heroInView) {
    monitorVideo.pause();
    return;
  }
  monitorVideo.muted = true;
  monitorVideo.play().catch(() => { /* The original photo remains visible if autoplay is blocked. */ });
}

monitorVideo.addEventListener('error', () => monitorVideo.classList.add('has-error'));
new ResizeObserver(alignMonitor).observe(heroVisual);
new IntersectionObserver(entries => {
  heroInView = entries[0].isIntersecting;
  updateMonitorPlayback();
}).observe(heroVisual);
reducedMotion.addEventListener('change', () => { alignMonitor(); updateMonitorPlayback(); });
document.addEventListener('visibilitychange', updateMonitorPlayback);
// A tap also retries playback on mobile browsers with restrictive autoplay settings.
document.addEventListener('pointerdown', updateMonitorPlayback, { once: true });
alignMonitor();

updateMonitorPlayback();
