const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav__links');
const toast = document.querySelector('.toast');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

function showSuccess(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3500);
}

document.querySelector('.booking').addEventListener('submit', event => {
  event.preventDefault();
  showSuccess('Thanks! Your appointment request has been received.');
  event.currentTarget.reset();
});

document.querySelector('#save-form').addEventListener('submit', event => {
  event.preventDefault();
  showSuccess('Your spot is saved. We’ll be in touch!');
  event.currentTarget.reset();
});

const animatedItems = document.querySelectorAll(
  '.section-heading, .hero__microcards span, .service-card, .reviews article, .result-slider, .trust__logos > div, .cta__inner, .save__inner'
);
animatedItems.forEach(item => item.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

animatedItems.forEach(item => observer.observe(item));

const header = document.querySelector('.header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const pageSections = document.querySelectorAll(
  '.trust, #services, #reviews, #results, .cta, .save, .footer__grid'
);
pageSections.forEach(section => {
  section.classList.add('page-reveal');
  observer.observe(section);
});

document.querySelectorAll('.result-slider').forEach(slider => {
  const beforeImage = slider.querySelector('.result-slider__before img');
  const syncImageWidth = () => {
    beforeImage.style.width = `${slider.getBoundingClientRect().width}px`;
  };
  syncImageWidth();
  window.addEventListener('resize', syncImageWidth);

  const setPosition = clientX => {
    const rect = slider.getBoundingClientRect();
    const percent = Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100));
    slider.style.setProperty('--position', `${percent}%`);
  };

  slider.addEventListener('pointerdown', event => {
    slider.setPointerCapture(event.pointerId);
    setPosition(event.clientX);
  });

  slider.addEventListener('pointermove', event => {
    if (slider.hasPointerCapture(event.pointerId)) setPosition(event.clientX);
  });

  slider.querySelector('.result-handle').addEventListener('click', event => {
    event.stopPropagation();
    const from = parseFloat(slider.style.getPropertyValue('--position')) || 50;
    const to = from >= 50 ? 22 : 78;
    const started = performance.now();
    const duration = 520;
    const move = now => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      slider.style.setProperty('--position', `${from + (to - from) * eased}%`);
      if (progress < 1) requestAnimationFrame(move);
    };
    requestAnimationFrame(move);
  });
});

const reviewTrack = document.querySelector('.reviews');
const reviewSlides = [...reviewTrack.children];
const reviewDots = document.querySelector('.review-dots');
let reviewIndex = 0;
let reviewTimer;

const reviewsPerView = () => window.innerWidth <= 780 ? 1 : 3;
const maxReviewIndex = () => Math.max(0, reviewSlides.length - reviewsPerView());

reviewSlides.slice(0, maxReviewIndex() + 1).forEach((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Show review slide ${index + 1}`);
  dot.addEventListener('click', () => moveReviews(index));
  reviewDots.appendChild(dot);
});

function moveReviews(index) {
  reviewIndex = Math.max(0, Math.min(index, maxReviewIndex()));
  const slideWidth = reviewSlides[0].getBoundingClientRect().width + 28;
  reviewTrack.style.transform = `translateX(-${reviewIndex * slideWidth}px)`;
  [...reviewDots.children].forEach((dot, i) => dot.classList.toggle('active', i === reviewIndex));
}

function startReviewAutoplay() {
  clearInterval(reviewTimer);
  reviewTimer = setInterval(() => {
    moveReviews(reviewIndex >= maxReviewIndex() ? 0 : reviewIndex + 1);
  }, 4500);
}

document.querySelector('.review-arrow--prev').addEventListener('click', () => {
  moveReviews(reviewIndex <= 0 ? maxReviewIndex() : reviewIndex - 1);
  startReviewAutoplay();
});
document.querySelector('.review-arrow--next').addEventListener('click', () => {
  moveReviews(reviewIndex >= maxReviewIndex() ? 0 : reviewIndex + 1);
  startReviewAutoplay();
});

let reviewTouchStart = 0;
document.querySelector('.reviews-viewport').addEventListener('pointerdown', event => {
  reviewTouchStart = event.clientX;
});
document.querySelector('.reviews-viewport').addEventListener('pointerup', event => {
  const distance = event.clientX - reviewTouchStart;
  if (Math.abs(distance) > 45) moveReviews(reviewIndex + (distance < 0 ? 1 : -1));
});

window.addEventListener('resize', () => moveReviews(reviewIndex));
moveReviews(0);
startReviewAutoplay();
