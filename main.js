/* Teyo — shared scripts for every language version.
   UI strings follow <html lang>. */

(function () {
  var t = {
    pl: { open: 'Otwórz zdjęcie' },
    de: { open: 'Foto öffnen' }
  }[document.documentElement.lang] || { open: 'Open photo' };

  /* Language switch: remember a manual choice, so the automatic
     redirect (in the <head> of the English pages) never overrides it. */
  document.querySelectorAll('[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('teyo-lang', a.dataset.lang); } catch (e) {}
    });
  });

  /* Reveal sections as they enter the screen (see .reveal in styles.css) */
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* Feature carousel: arrows and counter */
  (function () {
    var track = document.querySelector('.features__track');
    if (!track) return;
    var nav = document.querySelector('.features__nav');
    var count = document.querySelector('.features__count');
    var items = track.children;
    var total = String(items.length).padStart(2, '0');
    function step() { return items[1].offsetLeft - items[0].offsetLeft; }
    function update() {
      nav.hidden = track.scrollWidth <= track.clientWidth + 1;
      var i = Math.round(track.scrollLeft / step());
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) i = items.length - 1;
      count.textContent = String(i + 1).padStart(2, '0') + ' / ' + total;
    }
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) track.scrollBy({ left: step() * b.dataset.dir, behavior: 'smooth' });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* Photo lightbox. Each gallery (.photos grid, feature carousel) is browsed separately,
     with arrows, swipe or arrow keys, looping from last to first. */
  (function () {
    var box = document.querySelector('.lightbox');
    if (!box) return;
    var big = box.querySelector('.lightbox__img');
    var caption = box.querySelector('.lightbox__caption');
    var count = box.querySelector('.lightbox__count');
    var items = [];
    var index = 0;
    var step = 1;

    /* A photo whose file is missing has its <img> removed (onerror), so it is skipped. */
    function loaded(fig) {
      return fig.querySelector('img');
    }

    function show(i) {
      if (!items.length) { box.close(); return; }
      index = (i + items.length) % items.length;
      var fig = items[index];
      var img = loaded(fig);
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      caption.innerHTML = '';
      var feature = fig.closest('.feature');
      if (feature) {
        ['.feature__no', '.feature__title', '.feature__text'].forEach(function (sel) {
          var src = feature.querySelector(sel);
          if (src) caption.appendChild(src.cloneNode(true));
        });
      }
      box.classList.toggle('lightbox--captioned', !!feature);
      count.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : '';
    }

    function open(fig) {
      if (!loaded(fig)) return;
      var gallery = fig.closest('.photos, .features__track');
      items = Array.prototype.filter.call(gallery.querySelectorAll('.photo'), loaded);
      box.classList.toggle('lightbox--single', items.length < 2);
      step = 1;
      show(items.indexOf(fig));
      if (!box.open) box.showModal();
    }

    function go(d) { step = d; show(index + d); }

    document.querySelectorAll('.photos .photo, .features__track .photo').forEach(function (fig) {
      var img = fig.querySelector('img');
      if (!img) return;
      fig.classList.add('photo--zoom');
      fig.tabIndex = 0;
      fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', t.open + (img.alt ? ': ' + img.alt : ''));
      fig.addEventListener('click', function () { open(fig); });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(fig); }
      });
      img.addEventListener('error', function () {
        fig.classList.remove('photo--zoom');
        ['role', 'tabindex', 'aria-label'].forEach(function (a) { fig.removeAttribute(a); });
      });
    });

    /* The file behind this photo is missing: drop it from the gallery and move on. */
    big.addEventListener('error', function () {
      if (!box.open || !big.getAttribute('src')) return;
      var gone = items.splice(index, 1)[0];
      var img = gone.querySelector('img');
      if (img) img.dispatchEvent(new Event('error'));
      if (img) img.remove();
      box.classList.toggle('lightbox--single', items.length < 2);
      show(step > 0 ? index : index - 1);
    });

    box.querySelector('.lightbox__close').addEventListener('click', function () { box.close(); });
    box.querySelector('.lightbox__arrow--prev').addEventListener('click', function () { go(-1); });
    box.querySelector('.lightbox__arrow--next').addEventListener('click', function () { go(1); });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__stage')) box.close();
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
    box.addEventListener('close', function () { big.removeAttribute('src'); });

    var startX = null, startY = 0;
    box.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { startX = null; return; }
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null || items.length < 2) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      startX = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    });
  })();
})();
