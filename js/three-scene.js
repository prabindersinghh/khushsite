/**
 * Paintmates — 3D Effects (no WebGL)
 * 1. Hero depth parallax — mouse moves left/right panels at opposite depths
 * 2. CSS 3D card tilt on service cards, testimonials, process steps
 */
(function () {
  'use strict';

  /* ================================================
     HERO DEPTH PARALLAX
     Left panel shifts slightly toward mouse;
     right panel shifts away — creates genuine 3D depth.
     ================================================ */
  (function initHeroParallax() {
    if (window.innerWidth < 900) return;

    var hero      = document.getElementById('home');
    var leftPanel = hero && hero.querySelector('.hero-left');
    var rightPanel = hero && hero.querySelector('.hero-right-panel');
    var heroTag   = hero && hero.querySelector('.hero-tag');
    if (!hero || !leftPanel) return;

    var mx = 0, my = 0;
    var cx = 0, cy = 0;

    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;  /* -1 → 1 */
      my = (e.clientY / window.innerHeight - 0.5) * 2;  /* -1 → 1 */
    });

    var raf;
    function tick() {
      raf = requestAnimationFrame(tick);

      /* Smooth follow */
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;

      /* Layer 1 (closest): hero heading drifts toward mouse */
      leftPanel.style.transform =
        'translate3d(' + (cx * 9) + 'px,' + (cy * 5) + 'px, 0)';

      /* Layer 2 (mid): eyebrow tag moves at half speed */
      if (heroTag) {
        heroTag.style.transform =
          'translate3d(' + (cx * 5) + 'px,' + (cy * 3) + 'px, 0)';
      }

      /* Layer 3 (far): stats panel drifts opposite direction */
      if (rightPanel) {
        rightPanel.style.transform =
          'translate3d(' + (cx * -10) + 'px,' + (cy * -5) + 'px, 0)';
      }
    }
    tick();

    /* Stop when hero scrolls out of view */
    window.addEventListener('scroll', function () {
      if (!hero) return;
      var heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom < 0) {
        cancelAnimationFrame(raf);
        leftPanel.style.transform  = '';
        if (heroTag)    heroTag.style.transform    = '';
        if (rightPanel) rightPanel.style.transform = '';
      }
    }, { passive: true });

    /* Cleanup on resize below breakpoint */
    window.addEventListener('resize', function () {
      if (window.innerWidth < 900) {
        cancelAnimationFrame(raf);
        leftPanel.style.transform  = '';
        if (heroTag)    heroTag.style.transform    = '';
        if (rightPanel) rightPanel.style.transform = '';
      }
    });
  })();


  /* ================================================
     CSS 3D CARD TILT
     ================================================ */
  (function initCardTilt() {
    if (window.innerWidth < 768) return;

    var cards = document.querySelectorAll('.svc-card, .t-card, .p-step');

    cards.forEach(function (el) {
      var rect;
      var raf;

      el.addEventListener('mouseenter', function () {
        rect = el.getBoundingClientRect();
        el.style.willChange = 'transform';
      });

      el.addEventListener('mousemove', function (e) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          if (!rect) rect = el.getBoundingClientRect();
          var x  = e.clientX - rect.left;
          var y  = e.clientY - rect.top;
          var cx = rect.width  / 2;
          var cy = rect.height / 2;
          var rX = ((y - cy) / cy) * -8;
          var rY = ((x - cx) / cx) *  8;
          el.style.transition = 'transform 0.08s linear';
          el.style.transform  =
            'perspective(700px) rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) translateZ(14px)';
        });
      });

      el.addEventListener('mouseleave', function () {
        cancelAnimationFrame(raf);
        el.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
        el.style.transform  = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        el.style.willChange = 'auto';
      });
    });
  })();

})();
