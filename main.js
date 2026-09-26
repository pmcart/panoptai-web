// PanoptAI — Landing Page JS
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Contact form ----------------------------------------------------------
  // POSTs to the contact endpoint (see data-endpoint on the form), which emails the request.
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    var button = form.querySelector('button[type="submit"]');
    var buttonLabel = button.textContent;
    var GENERIC_ERROR = "We couldn't send your request. Please check your connection and try again.";

    var setStatus = function (kind, message) {
      status.textContent = message;
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
    };

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (button.disabled) return;

      var fields = {};
      new FormData(form).forEach(function (value, key) { fields[key] = String(value).trim(); });

      setStatus('', '');
      button.disabled = true;
      button.textContent = 'Sending…';

      var options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      };
      if (window.AbortSignal && AbortSignal.timeout) options.signal = AbortSignal.timeout(15000);

      fetch(form.dataset.endpoint, options)
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            if (!res.ok) throw new Error(body.error || GENERIC_ERROR);
          });
        })
        .then(function () {
          form.reset();
          button.textContent = 'Request received ✓';
          setStatus('success', "Thanks — we've received your request and will be in touch shortly.");
          // Keep the button locked briefly so a double-click can't send a duplicate.
          setTimeout(function () { button.disabled = false; button.textContent = buttonLabel; }, 5000);
        })
        .catch(function (err) {
          // Network/timeouts surface as TypeError/AbortError; server messages are already user-safe.
          var isServerMessage = err && err.message && err.name === 'Error';
          setStatus('error', isServerMessage ? err.message : GENERIC_ERROR);
          button.disabled = false;
          button.textContent = buttonLabel;
        });
    });
  }

  // ---- Mobile menu -----------------------------------------------------------
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
  }

  if (!('IntersectionObserver' in window)) return;

  // ---- Active nav highlighting ----------------------------------------------
  var navLinks = document.querySelectorAll('.nav-links a');
  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  document.querySelectorAll('section[id]').forEach(function (s) { sectionObserver.observe(s); });

  // ---- Entrance animations ---------------------------------------------------
  // Classes (not inline styles) so the hover lift on cards keeps working and no-JS visitors see everything.
  if (reduceMotion) return;
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );
  document
    .querySelectorAll('.problem-card, .feature-card, .pricing-card, .storage-mode, .capture-group, .pipeline-step')
    .forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
})();
