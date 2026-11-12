'use strict';

// Первая фотография в альбоме.
const FIRST_PHOTO = 'assets/01-eyes.png';

const photoDialog = document.querySelector('#photo-dialog');
const letterDialog = document.querySelector('#letter-dialog');
const largePhoto = document.querySelector('#large-photo');
const photoCaption = document.querySelector('#large-caption');
const photoCounter = document.querySelector('#photo-counter');
let photos = [];
let currentPhoto = 0;
let lastFocus = null;

function refreshPhotos() {
  photos = Array.from(document.querySelectorAll('[data-photo]'));
}

function openDialog(dialog) {
  lastFocus = document.activeElement;
  dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.querySelector('[data-close]').focus();
}

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const source = photos[currentPhoto];
  largePhoto.src = source.dataset.photo;
  largePhoto.alt = source.querySelector('img')?.alt || source.dataset.caption;
  photoCaption.textContent = source.dataset.caption;
  photoCounter.textContent = `${currentPhoto + 1} / ${photos.length}`;
}

document.addEventListener('click', (event) => {
  const photo = event.target.closest('[data-photo]');
  if (!photo) return;
  refreshPhotos();
  showPhoto(photos.indexOf(photo));
  openDialog(photoDialog);
});

document.querySelector('#photo-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
document.querySelector('#photo-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
photoDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(currentPhoto + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});
document.querySelector('#open-letter').addEventListener('click', () => openDialog(letterDialog));

for (const dialog of [photoDialog, letterDialog]) {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
  });
}

const wishes = [
  'Ты — моя любимая случайность.',
  'Пусть поводов улыбаться у тебя будет больше, чем причин грустить.',
  'Обнимаю. Даже если сейчас я не рядом.',
  'Пусть всё, о чём ты мечтаешь, понемногу сбывается.',
  'Ты такая красивая, когда улыбаешься. Улыбнись ♡',
  'Давай ещё много-много наших «а помнишь?».',
  'Из всех мест на свете мне особенно нравится рядом с тобой.',
  'Пусть у нас всегда находится время друг для друга.'
];
let wishIndex = 0;
let wishTimer;
const wish = document.querySelector('#wish');
document.querySelector('#wish-button').addEventListener('click', () => {
  clearTimeout(wishTimer);
  wishIndex = (wishIndex + 1) % wishes.length;
  wish.classList.add('is-changing');
  wishTimer = setTimeout(() => {
    wish.textContent = wishes[wishIndex];
    wish.classList.remove('is-changing');
  }, 150);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.querySelector('#hearts-layer');
  if (layer.childElementCount > 24) return;
  for (let i = 0; i < 7; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = '♡';
    heart.style.left = `${20 + Math.random() * 60}%`;
    heart.style.fontSize = `${15 + Math.random() * 19}px`;
    heart.style.animationDelay = `${i * 0.08}s`;
    layer.append(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
});

if (FIRST_PHOTO) {
  const image = new Image();
  image.alt = 'Тот самый случайный кадр, когда у тебя светились глаза';
  image.onload = () => {
    const visual = document.querySelector('#eyes-visual');
    const button = document.createElement('button');
    button.className = 'photo-button memory-visual eyes-visual has-photo';
    button.dataset.photo = FIRST_PHOTO;
    button.dataset.caption = 'А помнишь, как глаза светились тогда? А ты даже не знала, что я тебя фоткаю ♡';
    button.setAttribute('aria-label', 'Увеличить фотографию со светящимися глазами');
    button.append(image);
    const zoom = document.createElement('span');
    zoom.className = 'photo-zoom';
    zoom.setAttribute('aria-hidden', 'true');
    zoom.textContent = '↗';
    button.append(zoom);
    visual.replaceWith(button);
    refreshPhotos();
  };
  image.src = FIRST_PHOTO;
}
refreshPhotos();
