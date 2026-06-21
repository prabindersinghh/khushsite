/* ============================================
   PAINTMATES — Enhanced JavaScript
   paintmates.com.au | 0450 386 982
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ====== LOADING SCREEN ====== */
  const loader = document.getElementById('loadingScreen');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () { loader.classList.add('hidden'); }, 600);
    });
    setTimeout(function () { loader.classList.add('hidden'); }, 2200);
  }

  /* ====== SCROLL REVEAL ====== */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ====== NAV SCROLL ====== */
  var nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ====== SMOOTH SCROLL ====== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navHeight = document.getElementById('mainNav') ? document.getElementById('mainNav').offsetHeight : 72;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ====== MOBILE NAV TOGGLE ====== */
  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('active', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ====== BACK TO TOP ====== */
  var btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', function () {
      btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ====== ACTIVE NAV LINK ====== */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', function () {
      var current = '';
      var navH = nav ? nav.offsetHeight : 72;
      sections.forEach(function (section) {
        if (window.scrollY >= section.offsetTop - navH - 40) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(function (link) {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active-nav');
        }
      });
    }, { passive: true });
  }

  /* ====== COUNTER ANIMATION ====== */
  var counters = document.querySelectorAll('.counter');
  if (counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var current = 0;
          var increment = target / 60;
          var timer = setInterval(function () {
            current += increment;
            if (current >= target) {
              el.textContent = target + suffix;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current) + suffix;
            }
          }, 25);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* ====== BEFORE / AFTER SLIDERS ====== */
  document.querySelectorAll('.ba-wrap').forEach(function (wrap) {
    var range = wrap.querySelector('.ba-range');
    var after = wrap.querySelector('.ba-after');
    var divider = wrap.querySelector('.ba-divider');
    var handle = wrap.querySelector('.ba-handle');
    if (!range || !after) return;

    function update(val) {
      var pct = parseFloat(val);
      after.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      if (divider) divider.style.left = pct + '%';
      if (handle) handle.style.left = pct + '%';
    }

    update(range.value);
    range.addEventListener('input', function () { update(this.value); });

    var isDragging = false;
    wrap.addEventListener('mousedown', function () { isDragging = true; });
    document.addEventListener('mouseup', function () { isDragging = false; });
    wrap.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var rect = wrap.getBoundingClientRect();
      var pct = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
      range.value = pct;
      update(pct);
    });

    wrap.addEventListener('touchmove', function (e) {
      e.preventDefault();
      var rect = wrap.getBoundingClientRect();
      var touch = e.touches[0];
      var pct = Math.max(2, Math.min(98, ((touch.clientX - rect.left) / rect.width) * 100));
      range.value = pct;
      update(pct);
    }, { passive: false });
  });

  /* ====== FAQ ACCORDION ====== */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  /* ====== CONTACT FORM ======
     To enable real email delivery:
     1. Sign up free at https://formspree.io
     2. Create a form and copy your endpoint (e.g. https://formspree.io/f/abcd1234)
     3. Replace FORMSPREE_ENDPOINT below with your endpoint
  */
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.btn-submit');
      var successMsg = document.getElementById('formSuccess');

      // Honeypot check
      var honey = form.querySelector('[name="bot-field"]');
      if (honey && honey.value) return;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      var formData = new FormData(form);

      function showSuccess() {
        if (successMsg) { successMsg.classList.add('show'); }
        form.reset();
        form.style.display = 'none';
      }

      // If Formspree endpoint is configured, use it; otherwise show success UI directly
      if (FORMSPREE_ENDPOINT.indexOf('YOUR_FORM_ID') === -1) {
        fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        })
          .then(function (res) {
            if (res.ok) {
              showSuccess();
            } else {
              btn.textContent = 'Error — please call 0450 386 982';
              btn.disabled = false;
            }
          })
          .catch(function () {
            showSuccess();
          });
      } else {
        // No endpoint yet — show success and let customer call/WhatsApp
        setTimeout(showSuccess, 900);
      }
    });
  }

});
