// PanoptAI — Landing Page JS

// Form submission handler
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Submitted — we\'ll be in touch';
  btn.disabled = true;
  btn.style.background = '#10b981';
  btn.style.borderColor = '#10b981';
  // Reset after 5s for demo purposes
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    btn.style.background = '';
    btn.style.borderColor = '';
    e.target.reset();
  }, 5000);
}

// Smooth active nav highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => observer.observe(s));

// Subtle entrance animations
const cards = document.querySelectorAll(
  '.problem-card, .feature-card, .pricing-card, .storage-mode, .capture-group, .pipeline-step'
);

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

cards.forEach((card) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(18px)';
  card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  cardObserver.observe(card);
});
