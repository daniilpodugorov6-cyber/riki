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
