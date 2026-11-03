/* ============================================
   PAINTMATES — JavaScript
   paintmates.com.au | 0481 568 078
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ====== SCROLL REVEAL ====== */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ====== IMAGE FADE-IN ====== */
  document.querySelectorAll('.svc-img img, .intro-media img, .about-photo img, .gallery-photo img').forEach(function (img) {
    img.classList.add('img-fade');
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function () { img.classList.add('loaded'); });
      img.addEventListener('error', function () { img.classList.add('loaded'); });
    }
  });

  /* ====== NAV SCROLL + BACK TO TOP + ACTIVE LINK (one scroll handler) ====== */
  var nav = document.getElementById('mainNav');
  var btt = document.getElementById('backToTop');
  var sections = document.querySelectorAll('section[id]');
  // Scroll-spy only applies to same-page (#) links; inner pages mark their own link server-side.
  var navLinks = Array.prototype.filter.call(document.querySelectorAll('.nav-links a'), function (a) { return a.getAttribute('href').charAt(0) === '#'; });
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 50);
    if (btt) btt.classList.toggle('visible', y > 500);
    var current = '';
    var navH = nav ? nav.offsetHeight : 72;
    sections.forEach(function (section) {
      if (y >= section.offsetTop - navH - 40) current = section.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active-nav', link.getAttribute('href') === '#' + current);
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (btt) {
    btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ====== SMOOTH SCROLL ====== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 72;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ====== MOBILE NAV TOGGLE ====== */
  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    var setMenu = function (open) {
      mobileMenu.classList.toggle('open', open);
      mobileMenu.toggleAttribute('inert', !open);
      menuBtn.classList.toggle('active', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    setMenu(false);
    menuBtn.addEventListener('click', function () { setMenu(!mobileMenu.classList.contains('open')); });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
  }

  /* ====== COUNTER ANIMATION ====== */
  var counters = document.querySelectorAll('.counter');
  if (counters.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null;
        function step(t) {
          if (start === null) start = t;
          var p = Math.min((t - start) / 1400, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* ====== BEFORE / AFTER SLIDER ======
     The range input covers the photo, so mouse, touch and keyboard all work
     natively; touch-action in CSS keeps vertical page scrolling free. */
  document.querySelectorAll('.ba-wrap').forEach(function (wrap) {
    var range = wrap.querySelector('.ba-range');
    if (!range) return;
    function update() { wrap.style.setProperty('--pos', range.value + '%'); }
    range.addEventListener('input', update);
    update();
  });

  /* ====== FAQ ACCORDION ====== */
  document.querySelectorAll('.faq-item').forEach(function (item, i) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;
    btn.id = btn.id || 'faq-q-' + i;
    panel.id = panel.id || 'faq-a-' + i;
    btn.setAttribute('aria-controls', panel.id);
    panel.setAttribute('aria-labelledby', btn.id);
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ====== CONTACT FORM ======
     With FORMSPREE_ENDPOINT set (e.g. https://formspree.io/f/abcd1234), requests
     are posted there. Without it, the visitor's email app opens with the request
     filled in — so an enquiry is never silently dropped. */
  var FORMSPREE_ENDPOINT = '';
  var TO = 'matespaint@gmail.com';
  var WA = '61481568078';

  var form = document.getElementById('quoteForm');
  if (form) {
    var btn = form.querySelector('.btn-submit');
    var errorBox = document.getElementById('formError');
    var successBox = document.getElementById('formSuccess');
    var waLink = document.getElementById('waLink');
    var waDone = document.getElementById('waDone');
    var f = form.elements;

    var message = function () {
      var name = (f['first-name'].value + ' ' + f['last-name'].value).trim();
      return [
        'Hi Paintmates, I\'d like a free quote.',
        '',
        'Name: ' + name,
        'Phone: ' + f.phone.value.trim(),
        f.email.value.trim() ? 'Email: ' + f.email.value.trim() : null,
        'Suburb: ' + f.suburb.value.trim(),
        'Service: ' + (f.service.value || 'Not sure yet'),
        f.message.value.trim() ? 'Details: ' + f.message.value.trim() : null
      ].filter(function (line) { return line !== null; }).join('\n');
    };
    var waHref = function () { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(message()); };

    form.addEventListener('input', function (e) {
      waLink.href = waHref();
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.removeAttribute('aria-invalid');
    });

    var showSuccess = function (title, text) {
      if (title) document.getElementById('formSuccessTitle').textContent = title;
      if (text) document.getElementById('formSuccessText').textContent = text;
      form.style.display = 'none';
      successBox.classList.add('show');
      successBox.focus();
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f['bot-field'] && f['bot-field'].value) return; // honeypot

      var missing = [];
      form.querySelectorAll('[required]').forEach(function (el) {
        if (!el.value.trim()) { el.setAttribute('aria-invalid', 'true'); missing.push(el.dataset.label); }
        else el.removeAttribute('aria-invalid');
      });
      if (missing.length) {
        var list = missing.length > 1 ? missing.slice(0, -1).join(', ') + ' and ' + missing[missing.length - 1] : missing[0];
        errorBox.textContent = 'Add your ' + list + ' so we can quote the job.';
        errorBox.hidden = false;
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }
      errorBox.hidden = true;
      waDone.href = waHref();

      if (FORMSPREE_ENDPOINT) {
        btn.textContent = 'Sending…';
        btn.disabled = true;
        fetch(FORMSPREE_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
          .then(function (res) {
            if (!res.ok) throw new Error(res.status);
            showSuccess('Quote request sent', 'Thanks! We\'ll be in touch very soon — usually within a few hours. Need us sooner? Call 0481 568 078.');
          })
          .catch(function () {
            btn.textContent = 'Send Quote Request';
            btn.disabled = false;
            errorBox.textContent = 'Your request didn\'t send. Please call 0481 568 078 or use the WhatsApp button below.';
            errorBox.hidden = false;
          });
        return;
      }

      var subject = 'Quote request: ' + (f.service.value || 'painting') + ' in ' + f.suburb.value.trim();
      window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message());
      showSuccess();
    });
  }

});
