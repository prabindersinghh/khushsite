/* ============================================
   PAINTMATES — Service area map
   Loads Leaflet and the suburb list only when the map is near the screen.
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('suburbMap');
  if (!el) return;

  function loadCss(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function showError() {
    el.innerHTML = '<p class="map-loading">The map didn\'t load. Call 0481 568 078 to check your suburb.</p>';
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function start(suburbs) {
    el.innerHTML = '';
    var isTouch = window.matchMedia('(pointer: coarse)').matches;
    // On phones one finger keeps scrolling the page; two fingers move the map.
    var map = L.map(el, { scrollWheelZoom: false, dragging: !isTouch, touchZoom: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 16,
      minZoom: 8,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
    }).addTo(map);

    var pins = suburbs.map(function (s) {
      var pin = L.circleMarker([s.a, s.o], { radius: s.u ? 6 : 4, color: '#0a0908', weight: 1, fillColor: s.u ? '#e8c96a' : '#c9a84c', fillOpacity: s.u ? 1 : 0.85 });
      var link = s.u ? '<a href="' + s.u + '">Painters in ' + escapeHtml(s.n) + '</a>' : '<a href="/contact">Get a free quote</a>';
      pin.bindPopup('<strong>' + escapeHtml(s.n) + ' ' + escapeHtml(s.p) + '</strong>' + escapeHtml(s.r) + '<br>' + link);
      pin.region = s.r;
      return pin;
    });

    function show(region) {
      var visible = [];
      pins.forEach(function (pin) {
        if (!region || pin.region === region) { pin.addTo(map); visible.push(pin.getLatLng()); }
        else { map.removeLayer(pin); }
      });
      if (visible.length) map.fitBounds(L.latLngBounds(visible), { padding: [24, 24] });
    }

    document.querySelectorAll('.map-chip').forEach(function (chip, i, chips) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        show(chip.getAttribute('data-region'));
      });
    });

    // Show every pin, but open framed on Brisbane itself.
    show('');
    var brisbane = pins.filter(function (pin) { return /Brisbane/.test(pin.region); }).map(function (pin) { return pin.getLatLng(); });
    map.fitBounds(L.latLngBounds(brisbane), { padding: [12, 12] });
  }

  function init() {
    loadCss('/js/vendor/leaflet.css');
    Promise.all([
      loadScript('/js/vendor/leaflet.js'),
      fetch('/js/suburbs.json').then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
    ]).then(function (results) { start(results[1]); }).catch(showError);
  }

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { observer.disconnect(); init(); }
  }, { rootMargin: '400px 0px' });
  observer.observe(el);
});
