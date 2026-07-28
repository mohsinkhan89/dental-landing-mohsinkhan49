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
  '.section-heading, .service-card, .reviews article, .result, .trust__logos > div, .save__inner'
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
