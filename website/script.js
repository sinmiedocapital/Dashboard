/* Sin Miedo Capital — site interactions (vanilla JS) */
(function () {
  'use strict';

  /* ============================================================
     WAITLIST ENDPOINT
     ------------------------------------------------------------
     Paste your Formspree form URL between the quotes below.
     Get it free at https://formspree.io  (New Form → copy the
     endpoint, it looks like  https://formspree.io/f/abcwxyz ).

     Until you replace this, the form still works as a live demo:
     it shows the success message but does NOT send anywhere.
     ============================================================ */
  var WAITLIST_ENDPOINT = 'https://formspree.io/f/your_form_id';

  function isConfigured() {
    return WAITLIST_ENDPOINT.indexOf('your_form_id') === -1;
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close menu after tapping a link
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Waitlist forms ---- */
  document.querySelectorAll('form[data-waitlist]').forEach(function (form) {
    // build an error line we can show if a submission fails
    var error = document.createElement('p');
    error.className = 'form-error';
    error.setAttribute('role', 'alert');
    form.appendChild(error);

    function showSuccess() {
      form.classList.add('submitted');
      var ok = form.querySelector('.form-success');
      if (ok) ok.classList.add('show');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      error.classList.remove('show');

      var input = form.querySelector('input[type="email"]');
      if (input && !input.checkValidity()) {
        input.reportValidity();
        return;
      }

      // Demo mode: no endpoint set yet — just confirm visually.
      if (!isConfigured()) {
        showSuccess();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

      var data = new FormData(form);
      data.append('_subject', 'New SMC waitlist signup');
      data.append('page', document.title);

      fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      })
        .then(function (res) {
          if (res.ok) {
            showSuccess();
          } else {
            return res.json().then(function (d) {
              throw new Error((d && d.error) || 'Something went wrong.');
            });
          }
        })
        .catch(function () {
          error.textContent = 'Sorry — that didn’t go through. Please try again.';
          error.classList.add('show');
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
    });
  });

  /* ---- Reveal-on-scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Year in footer ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
