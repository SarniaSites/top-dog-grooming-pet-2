/* Top Dog Grooming & Pet Care — site behaviour (vanilla JS, no libraries).
   Sections: intro · header + day track · mobile menu · time cues · the day (services) ·
   line-up + lightbox · form · mobile bar */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- hero intro: photo wipes in from the seam, lines stagger, the sun rises ---------- */
  var hero = $('.hero');
  $$('[data-intro]').forEach(function (el, i) { el.style.setProperty('--i', i); });
  requestAnimationFrame(function () { requestAnimationFrame(function () { hero && hero.classList.add('is-loaded'); }); });

  /* ---------- header shrink, active nav, and the sun travelling along the header edge ---------- */
  var header = $('#siteHeader');
  var dot = $('#dayDot');
  var track = $('.day-track');
  var bar = $('#mobileBar');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    var w = track.clientWidth;
    track.style.setProperty('--p', (p * 100).toFixed(2) + '%');
    dot.style.setProperty('--px', Math.round(10 + p * (w - 20)) + 'px');
    dot.classList.toggle('is-night', p > 0.86);
    if (bar) bar.classList.toggle('is-on', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  var navLinks = $$('.nav-link');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['work', 'services', 'about', 'reviews', 'contact'].forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- mobile menu ---------- */
  var menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
  function closeMenu() { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Open menu'); }
  menuBtn.addEventListener('click', function () {
    var open = menu.hidden;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); menuBtn.focus(); } });

  /* ---------- time cues: put the little sun on each heading's arc ---------- */
  $$('.timecue-arc').forEach(function (svg) {
    var t = parseFloat(svg.getAttribute('data-t')) || 0;
    var a = Math.PI * (1 - t);
    var cx = 14 + 10 * Math.cos(a), cy = 14 - 10 * Math.sin(a);
    var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx.toFixed(2)); c.setAttribute('cy', cy.toFixed(2)); c.setAttribute('r', '3.4');
    c.setAttribute('class', 'timecue-sun');
    svg.setAttribute('viewBox', '0 0 28 16');
    svg.appendChild(c);
  });

  /* ---------- THE DAY: drag the sun along its arc; the sky and the service change ---------- */
  var day = $('#services');
  var path = $('#sunPath');
  var handle = $('#sunHandle');
  var sky = $('#sky');
  var svg = $('.sky-svg');
  var tabs = $$('.stop');
  var panels = $$('.panel');
  var STOPS = [0.14, 0.5, 0.84, 1.0];
  var NAMES = ['Morning: grooming', 'Daytime: day care', 'Evening: evening care', 'Overnight: boarding'];
  // sky keyframes (t, colour): dawn peach (the sun orange, tinted) -> day green-white -> dusk -> night
  var SKY = [[0, [251, 230, 207]], [0.5, [231, 238, 226]], [0.84, [248, 207, 160]], [0.93, [26, 48, 36]], [1, [16, 32, 24]]];
  var current = 0, t = STOPS[0], len = path.getTotalLength(), anim = null;

  // stop markers on the arc
  var marks = $('#stopMarks');
  STOPS.forEach(function (s) {
    var pt = path.getPointAtLength(s * len);
    var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.setAttribute('r', '6');
    c.setAttribute('class', 'stop-mark');
    marks.appendChild(c);
  });

  function mix(a, b, k) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * k); }); }
  function skyAt(tt) {
    for (var i = 1; i < SKY.length; i++) {
      if (tt <= SKY[i][0]) { var k = (tt - SKY[i - 1][0]) / (SKY[i][0] - SKY[i - 1][0]); return mix(SKY[i - 1][1], SKY[i][1], k); }
    }
    return SKY[SKY.length - 1][1];
  }
  function place(tt) {
    t = Math.max(0, Math.min(1, tt));
    var pt = path.getPointAtLength(t * len);
    var box = svg.getBoundingClientRect();
    var sc = box.width / 1000;
    handle.style.transform = 'translate(' + (pt.x * sc).toFixed(1) + 'px,' + (pt.y * sc).toFixed(1) + 'px)';
    var c = skyAt(t);
    day.style.setProperty('--sky', 'rgb(' + c.join(',') + ')');
    day.classList.toggle('is-night', t > 0.9);
  }
  function nearest(tt) {
    var best = 0;
    STOPS.forEach(function (s, i) { if (Math.abs(s - tt) < Math.abs(STOPS[best] - tt)) best = i; });
    return best;
  }
  function select(i, focusTab) {
    if (i === current && !focusTab) return;
    current = i;
    tabs.forEach(function (b, j) {
      var on = j === i;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p, j) { var on = j === i; p.hidden = !on; p.classList.toggle('is-on', on); });
    handle.setAttribute('aria-valuenow', String(i));
    handle.setAttribute('aria-valuetext', NAMES[i]);
    if (focusTab) tabs[i].focus();
  }
  function glide(to) {
    cancelAnimationFrame(anim);
    if (reduce) { place(to); return; }
    var from = t, start = performance.now(), dur = 380 + Math.abs(to - from) * 700;
    (function step(now) {
      var k = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      place(from + (to - from) * e);
      if (k < 1) anim = requestAnimationFrame(step);
    })(start);
  }
  function go(i, focusTab) { select(i, focusTab); glide(STOPS[i]); }

  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { go(i); });
    b.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % tabs.length;
      if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
      if (k === 'Home') n = 0; if (k === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); go(n, true); }
    });
  });
  handle.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowUp') { e.preventDefault(); go(Math.min(3, current + 1)); }
    if (k === 'ArrowLeft' || k === 'ArrowDown') { e.preventDefault(); go(Math.max(0, current - 1)); }
    if (k === 'Home') { e.preventDefault(); go(0); }
    if (k === 'End') { e.preventDefault(); go(3); }
  });

  // dragging: the sun follows the pointer along the arc (x maps straight to t, the curve is symmetrical)
  var dragging = false;
  function tFromEvent(e) {
    var box = svg.getBoundingClientRect();
    var x = (e.clientX - box.left) / box.width * 1000;
    return (x - 40) / 920;
  }
  handle.addEventListener('pointerdown', function (e) {
    dragging = true; cancelAnimationFrame(anim);
    handle.setPointerCapture(e.pointerId);
    handle.classList.add('is-dragging');
  });
  handle.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    place(tFromEvent(e));
    select(nearest(t));
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; handle.classList.remove('is-dragging');
    go(nearest(t));
  }
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
  // tapping the sky itself also moves the sun there
  svg.addEventListener('click', function (e) { var tt = tFromEvent(e); go(nearest(Math.max(0, Math.min(1, tt)))); });

  window.addEventListener('resize', function () { place(t); });
  place(t);

  // "Ask about…" buttons preselect the service in the form
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () { var sel = $('#f-service'); if (sel) sel.value = a.getAttribute('data-service'); });
  });

  /* ---------- line-up: arrows scroll the row; photos open the lightbox ---------- */
  var row = $('#lineup');
  $$('[data-scroll]').forEach(function (b) {
    b.addEventListener('click', function () {
      row.scrollBy({ left: parseInt(b.getAttribute('data-scroll'), 10) * Math.min(640, row.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  var shots = $$('.dog'), at = 0, lastFocus = null;
  function show(i) {
    at = (i + shots.length) % shots.length;
    var b = shots[at], img = $('img', b);
    lbImg.src = b.getAttribute('data-full');
    lbImg.alt = img.alt;
    lbCap.textContent = b.getAttribute('data-caption') || '';
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
  }
  function openLb(i) { lastFocus = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-close').focus(); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  shots.forEach(function (b, i) { b.addEventListener('click', function () { openLb(i); }); });
  $('.lb-close').addEventListener('click', closeLb);
  $('.lb-prev').addEventListener('click', function () { show(at - 1); });
  $('.lb-next').addEventListener('click', function () { show(at + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
    if (e.key === 'Tab') { // keep focus inside
      var f = $$('.lb-btn', lb), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  var sx = null;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 45) show(at + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ---------- enquiry form: inline validation, then a sending state ---------- */
  var form = $('#enquiry');
  if (form) {
    var fields = $$('input[required], select[required], textarea[required]', form);
    function check(el) {
      var ok = el.checkValidity() && String(el.value).trim() !== '';
      var wrap = el.closest('.field');
      wrap.classList.toggle('is-bad', !ok);
      wrap.classList.toggle('is-good', ok);
      el.setAttribute('aria-invalid', String(!ok));
      return ok;
    }
    fields.forEach(function (el) {
      var err = $('.field-err[data-for="' + el.id + '"]', form);
      if (err) { err.id = el.id + '-err'; el.setAttribute('aria-describedby', err.id); }
      el.addEventListener('blur', function () { if (el.value) check(el); });
      el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-bad')) check(el); });
      el.addEventListener('change', function () { check(el); });
    });
    form.addEventListener('submit', function (e) {
      var bad = fields.filter(function (el) { return !check(el); });
      if (bad.length) { e.preventDefault(); bad[0].focus(); $('.form-status', form).textContent = 'Please fill in the highlighted boxes.'; return; }
      var btn = $('.submit', form);
      btn.classList.add('is-busy'); btn.setAttribute('aria-disabled', 'true');
      $('.form-status', form).textContent = 'Sending your enquiry…';
    });
  }
})();
