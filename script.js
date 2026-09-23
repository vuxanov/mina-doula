const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
const menu = document.querySelector('.site-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const contactSection = document.querySelector('#contact');
const faqSection = document.querySelector('#faq');

if (contactSection && faqSection) faqSection.after(contactSection);

const contactSocials = document.querySelector('.contact-socials');

if (contactSocials && !contactSocials.querySelector('[data-mama-sutra-instagram]')) {
  const mamaSutraInstagram = document.createElement('a');
  mamaSutraInstagram.className = 'social-link';
  mamaSutraInstagram.href = 'https://www.instagram.com/_mama_sutra__?stkn=MW9pOHY4OGxkaHBrdQ==';
  mamaSutraInstagram.target = '_blank';
  mamaSutraInstagram.rel = 'noreferrer';
  mamaSutraInstagram.dataset.mamaSutraInstagram = '';
  mamaSutraInstagram.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><circle cx="12" cy="12" r="3.6" /><circle cx="17.4" cy="6.7" r=".7" fill="currentColor" stroke="none" /></svg><span>Instagram Serbian</span><span class="social-handle">@_mama_sutra__</span>';
  contactSocials.querySelector('.social-link')?.after(mamaSutraInstagram);
}

let lastScrollY = window.scrollY;
let scrollTicking = false;

function updateHeaderVisibility() {
  const currentScrollY = window.scrollY;
  const isMovingDown = currentScrollY > lastScrollY;
  const menuIsOpen = header?.classList.contains('menu-open');

  header?.classList.toggle('header-hidden', currentScrollY > 120 && isMovingDown && !menuIsOpen);
  lastScrollY = currentScrollY;
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateHeaderVisibility);
    scrollTicking = true;
  }
}, { passive: true });

const portfolioPhotos = [
  '_Z1A0780.jpg', '_Z1A2058.jpg', '_Z1A0827.jpg', '_Z1A5909.JPG', '_Z1A5919.JPG',
  '_Z1A5895.jpg', '_Z1A5934.jpg', '_Z1A0555.jpg', '_Z1A0703.jpg',
  '_Z1A1991.jpg', '_Z1A2055.jpg', '_Z1A2218.jpg', '_Z1A2277.jpg', '_Z1A2487.jpg',
  '_Z1A5086.JPG', '_Z1A5152.JPG', '_Z1A5329.JPG', '_Z1A5354.JPG',
  '_Z1A5827.jpg', '_Z1A7268.jpg', '_Z1A7281.jpg', '_Z1A7478 2.jpg', '_Z1A7608.jpg',
  '_Z1A7632.jpg', '_Z1A9050.jpg', '_Z1A9111.jpg', '_Z1A9160.jpg', '_Z1A9253.jpg',
  '_Z1A9461.jpg', '100049030024a.jpg', '100049030036a.jpg',
].map((filename) => ({
  filename,
  thumbSrc: `Images/Maternity%20photoshoot/web/thumb/${encodeURIComponent(filename.replace(/\.[^.]+$/, '.webp')).replaceAll('%2F', '/')}`,
  fullSrc: `Images/Maternity%20photoshoot/web/full/${encodeURIComponent(filename.replace(/\.[^.]+$/, '.webp')).replaceAll('%2F', '/')}`,
  alt: 'Maternity photograph by Mina',
}));

function photoButton(index, className = '') {
  const photo = portfolioPhotos[index];
  return `<button class="${className}" type="button" data-photo-index="${index}" aria-label="Open photo ${index + 1} of ${portfolioPhotos.length}"><img src="${photo.thumbSrc}" alt="${photo.alt}" loading="lazy" decoding="async" /></button>`;
}

let lightbox;
let lastLightboxTrigger;

function createLightbox() {
  if (lightbox) return lightbox;

  lightbox = document.createElement('dialog');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-label', 'Photography lightbox');
  lightbox.innerHTML = `
    <button class="icon-button lightbox-close" type="button" data-lightbox-close aria-label="Close photo"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
    <div class="lightbox-frame">
      <button class="icon-button" type="button" data-lightbox-previous aria-label="Previous photo"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m14.5 5-7 7 7 7" /></svg></button>
      <figure class="lightbox-figure"><img data-lightbox-image alt="" /><figcaption data-lightbox-caption></figcaption></figure>
      <button class="icon-button" type="button" data-lightbox-next aria-label="Next photo"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9.5 5 7 7-7 7" /></svg></button>
    </div>`;
  document.body.append(lightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('close', () => lastLightboxTrigger?.focus());
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showLightboxPhoto(Number(lightbox.dataset.index) - 1);
    if (event.key === 'ArrowRight') showLightboxPhoto(Number(lightbox.dataset.index) + 1);
  });
  lightbox.querySelector('[data-lightbox-previous]').addEventListener('click', () => showLightboxPhoto(Number(lightbox.dataset.index) - 1));
  lightbox.querySelector('[data-lightbox-next]').addEventListener('click', () => showLightboxPhoto(Number(lightbox.dataset.index) + 1));
  return lightbox;
}

function showLightboxPhoto(index) {
  const normalizedIndex = (index + portfolioPhotos.length) % portfolioPhotos.length;
  const dialog = createLightbox();
  const photo = portfolioPhotos[normalizedIndex];
  dialog.dataset.index = String(normalizedIndex);
  dialog.querySelector('[data-lightbox-image]').src = photo.fullSrc;
  dialog.querySelector('[data-lightbox-image]').alt = photo.alt;
  dialog.querySelector('[data-lightbox-caption]').textContent = `${normalizedIndex + 1} / ${portfolioPhotos.length}`;
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-photo-index]');
  if (!trigger) return;
  lastLightboxTrigger = trigger;
  showLightboxPhoto(Number(trigger.dataset.photoIndex));
  if (!lightbox.open) lightbox.showModal();
});

const carousel = document.querySelector('[data-carousel]');

if (carousel) {
  const track = carousel.querySelector('[data-carousel-track]');
  const status = carousel.querySelector('[data-carousel-status]');
  const groupSize = 5;
  const slides = Array.from({ length: Math.ceil(portfolioPhotos.length / groupSize) }, (_, slideIndex) => {
    const firstIndex = slideIndex * groupSize;
    const indexes = Array.from({ length: groupSize }, (_, offset) => (firstIndex + offset) % portfolioPhotos.length);
    return `<article class="bento-slide" aria-label="Photography selection ${slideIndex + 1} of ${Math.ceil(portfolioPhotos.length / groupSize)}">${indexes.map((index) => photoButton(index, 'bento-photo')).join('')}</article>`;
  });
  track.innerHTML = slides.join('');

  let currentSlide = 0;
  let pauseCarousel = false;
  const totalSlides = slides.length;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    status.textContent = `${currentSlide + 1} / ${totalSlides}`;
  }

  function moveCarousel(step) {
    currentSlide = (currentSlide + step + totalSlides) % totalSlides;
    renderCarousel();
  }

  carousel.querySelector('[data-carousel-previous]').addEventListener('click', () => moveCarousel(-1));
  carousel.querySelector('[data-carousel-next]').addEventListener('click', () => moveCarousel(1));
  carousel.addEventListener('mouseenter', () => { pauseCarousel = true; });
  carousel.addEventListener('mouseleave', () => { pauseCarousel = false; });
  carousel.addEventListener('focusin', () => { pauseCarousel = true; });
  carousel.addEventListener('focusout', () => { pauseCarousel = false; });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveCarousel(-1);
    if (event.key === 'ArrowRight') moveCarousel(1);
  });
  carousel.tabIndex = 0;
  renderCarousel();

  if (!reducedMotion) {
    window.setInterval(() => {
      if (!pauseCarousel) moveCarousel(1);
    }, 6500);
  }
}

const testimonialCarousel = document.querySelector('[data-testimonial-carousel]');

if (testimonialCarousel) {
  const track = testimonialCarousel.querySelector('[data-testimonial-track]');
  const slides = Array.from(track.children);
  const status = testimonialCarousel.querySelector('[data-testimonial-status]');
  let currentSlide = 0;

  function renderTestimonialCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    status.textContent = `${currentSlide + 1} / ${slides.length}`;
    slides.forEach((slide, index) => {
      const isCurrent = index === currentSlide;
      slide.setAttribute('aria-hidden', String(!isCurrent));
      slide.inert = !isCurrent;
    });
  }

  function moveTestimonialCarousel(step) {
    currentSlide = (currentSlide + step + slides.length) % slides.length;
    renderTestimonialCarousel();
  }

  testimonialCarousel.querySelector('[data-testimonial-previous]').addEventListener('click', () => moveTestimonialCarousel(-1));
  testimonialCarousel.querySelector('[data-testimonial-next]').addEventListener('click', () => moveTestimonialCarousel(1));
  testimonialCarousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveTestimonialCarousel(-1);
    if (event.key === 'ArrowRight') moveTestimonialCarousel(1);
  });

  renderTestimonialCarousel();
}

const masonryGallery = document.querySelector('[data-masonry-gallery]');

if (masonryGallery) {
  masonryGallery.innerHTML = portfolioPhotos.map((_, index) => photoButton(index, 'masonry-photo')).join('');
}
