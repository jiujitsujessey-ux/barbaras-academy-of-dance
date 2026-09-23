/* ============================================================
   Barbara's Academy of Dance — shared craft layer
   Imported by each page's Design Component (componentDidMount).
   Everything is progressive enhancement: pages read fine without it.
   initSite(opts) returns a teardown function.
   opts: { page, motion: 'full'|'calm', showAnnounce: bool, snow: bool }
   ============================================================ */

let prevTeardown = null;

export function initSite(opts = {}) {
  if (prevTeardown) { try { prevTeardown(); } catch (e) {} prevTeardown = null; }

  /* visitor counting (GoatCounter) — live site only */
  if (!window.goatcounter && /(^|\.)bh-?dance/.test(location.hostname) && !/\.dc\.html$/.test(location.pathname)) {
    window.goatcounter = {};
    const gc = document.createElement('script');
    gc.async = true;
    gc.dataset.goatcounter = 'https://bhdance.goatcounter.com/count';
    gc.src = 'https://gc.zgo.at/count.js';
    document.head.appendChild(gc);
    const va = document.createElement('script');
    va.defer = true;
    va.src = '/_vercel/insights/script.js';
    document.head.appendChild(va);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-8HRPFFN816');
    const ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-8HRPFFN816';
    document.head.appendChild(ga);
  }

  const doc = document;
  const root = doc.documentElement;
  const qs = (s, c) => (c || doc).querySelector(s);
  const qsa = (s, c) => Array.prototype.slice.call((c || doc).querySelectorAll(s));
  const ce = (tag, cls) => { const n = doc.createElement(tag); if (cls) n.className = cls; return n; };

  let reduced = false;
  try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  const calm = reduced || opts.motion === 'calm';
  let fine = false;
  try { fine = matchMedia('(pointer: fine)').matches; } catch (e) {}

  /* ---- lifecycle registry ---- */
  const offs = [];
  const observers = [];
  const created = [];
  let dead = false;
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); offs.push(() => t.removeEventListener(ev, fn, o)); };
  const io = (fn, o) => { const ob = new IntersectionObserver(fn, o); observers.push(ob); return ob; };
  const loop = fn => {
    const step = t => { if (dead) return; fn(t); requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  /* ================= props ================= */
  if (opts.showAnnounce === false) { const a = qs('.announce'); if (a) a.style.display = 'none'; }

  /* ============ image wipe-reveal candidates ============
     Tag BEFORE the .js class lands so nothing flashes. */
  if (!calm) {
    qsa('.hero-photo img, .champ img, .prog-card > img, .family-photo img, .gal-item img, .tile img, .cast-wrap img')
      .forEach(img => img.classList.add('ir'));
  }
  qsa('.tile-btn').forEach(b => { if (!b.hasAttribute('data-cursor')) b.setAttribute('data-cursor', 'View'); });

  /* Studio-editable contact details (from the admin page) */
  fetch('./site-data.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(d => {
    const pt = (d && d.pageText) || {};
    if (pt['contact.phone']) {
      const tel = 'tel:+1' + pt['contact.phone'].replace(/\D/g, '');
      qsa('a[href^="tel:"]').forEach(a => { a.href = tel; if (/\d{3}/.test(a.textContent)) a.textContent = pt['contact.phone']; });
    }
    if (pt['contact.email']) {
      qsa('a[href^="mailto:"]').forEach(a => {
        if (a.hasAttribute('data-keep-email')) return;
        const keep = a.href.split('?')[1];
        if (a.textContent.indexOf('@') >= 0) a.textContent = pt['contact.email'];
        a.href = 'mailto:' + pt['contact.email'] + (keep ? '?' + keep : '');
      });
    }
    const ann = d && d.announcement;
    const annEl = qs('.announce[data-announce="admin"]');
    if (ann && annEl) {
      if (ann.show === false) { annEl.style.display = 'none'; }
      else if (ann.text) {
        const link = annEl.querySelector('a');
        annEl.textContent = '';
        annEl.append(ann.text + ' ');
        if (link) {
          if (ann.linkText) link.textContent = ann.linkText;
          if (ann.linkHref) link.href = ann.linkHref;
          annEl.append(link);
        }
      }
    }
  }).catch(() => {});

  /* Play the intro curtain only on the first page of a visit —
     replaying it on every click between pages feels slow and glitchy. */
  try {
    if (sessionStorage.getItem('bh-nav')) {
      const c = qs('.curtain');
      if (c) c.remove();
    }
    sessionStorage.setItem('bh-nav', '1');
  } catch (e) {}

  root.classList.add('js');
  if (fine && !calm) root.classList.add('cursor-on');

  /* ================= mobile menu ================= */
  const nav = qs('.nav');
  const menuBtn = qs('#menu-btn');
  if (menuBtn && nav) {
    on(menuBtn, 'click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    qsa('.m-panel a').forEach(a => on(a, 'click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ================= nav scrolled state ================= */
  const navScroll = () => { if (nav) nav.classList.toggle('scrolled', (window.pageYOffset || root.scrollTop || 0) > 8); };
  on(window, 'scroll', navScroll, { passive: true });
  navScroll();

  /* ================= reveals ================= */
  if ('IntersectionObserver' in window) {
    const rio = io(entries => {
      let hit = 0;
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        setTimeout(() => { if (!dead) el.classList.add('in'); }, calm ? 0 : hit * 90);
        hit++;
        rio.unobserve(el);
      });
    }, { threshold: 0.12 });
    qsa('.reveal').forEach(el => rio.observe(el));

    /* image wipes — wait for the image itself before revealing */
    const iio = io(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        iio.unobserve(el);
        const go = () => { if (!dead) el.classList.add('in'); };
        if (el.complete || !el.getAttribute('src')) go();
        else {
          on(el, 'load', go, { once: true });
          on(el, 'error', go, { once: true });
          setTimeout(go, 4000); /* never leave a photo hidden */
        }
      });
    }, { threshold: 0.05 });
    qsa('img.ir').forEach(el => iio.observe(el));
  } else {
    qsa('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ================= count-up numbers ================= */
  qsa('[data-count]').forEach(el => {
    const end = parseInt(el.getAttribute('data-count'), 10);
    if (!isFinite(end)) return;
    if (calm) return;
    el.textContent = '0';
    const cio = io(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      cio.unobserve(el);
      const t0 = performance.now(), dur = 1400;
      const step = now => {
        if (dead) return;
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 4);
        el.textContent = String(Math.round(end * e));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    cio.observe(el);
  });

  /* ================= split-line heading reveals ================= */
  const ORIG = splitStore();
  function splitStore() {
    if (!window.__badSplitOrig) window.__badSplitOrig = new WeakMap();
    return window.__badSplitOrig;
  }
  function doSplit(el) {
    if (!ORIG.has(el)) ORIG.set(el, el.innerHTML);
    else el.innerHTML = ORIG.get(el);
    const words = [];
    Array.prototype.slice.call(el.childNodes).forEach(node => {
      if (node.nodeType === 3) {
        const parts = node.textContent.split(/(\s+)/);
        const frag = doc.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(doc.createTextNode(' ')); return; }
          const w = ce('span', 'sl-w'); w.textContent = p;
          frag.appendChild(w); words.push(w);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        node.classList.add('sl-w'); words.push(node);
      }
    });
    /* group words into visual lines */
    const lines = []; let lastTop = null;
    words.forEach(w => {
      const t = Math.round(w.offsetTop);
      if (lastTop === null || Math.abs(t - lastTop) > 4) { lines.push([]); lastTop = t; }
      lines[lines.length - 1].push(w);
    });
    const frag = doc.createDocumentFragment();
    lines.forEach((ws, i) => {
      const line = ce('span', 'sl-line');
      const inner = ce('span', 'sl-in');
      inner.style.transitionDelay = (i * 0.09) + 's';
      ws.forEach(w => { inner.appendChild(w); inner.appendChild(doc.createTextNode(' ')); });
      line.appendChild(inner);
      frag.appendChild(line);
    });
    el.innerHTML = '';
    el.appendChild(frag);
    el.classList.add('split-on');
    if (el.dataset.done) {
      el.classList.add('in-view');
      qsa('.sl-in', el).forEach(sp => { sp.style.transition = 'none'; sp.style.transform = 'translateY(0)'; });
    }
  }
  if (!calm && 'IntersectionObserver' in window && doc.fonts && doc.fonts.ready) {
    const sio = io(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in-view');
      en.target.dataset.done = '1';
      sio.unobserve(en.target);
    }), { threshold: 0.3 });
    doc.fonts.ready.then(() => {
      if (dead) return;
      qsa('[data-split]').forEach(el => { doSplit(el); sio.observe(el); });
    });
    let lastW = window.innerWidth, rzt = 0;
    on(window, 'resize', () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      clearTimeout(rzt);
      rzt = setTimeout(() => { if (!dead) qsa('[data-split].split-on').forEach(doSplit); }, 220);
    });
  }

  /* ================= soft parallax ================= */
  const wide = (() => { try { return matchMedia('(min-width: 861px)').matches; } catch (e) { return true; } })();
  if (!calm && wide) {
    let paras = [];
    const collect = () => {
      paras = [];
      qsa('[data-para],[data-para-img]').forEach(n => {
        const r = n.getBoundingClientRect();
        const top = r.top + (window.pageYOffset || root.scrollTop || 0);
        paras.push({
          el: n,
          speed: parseFloat(n.getAttribute('data-para') || n.getAttribute('data-para-img')) || 0,
          isImg: n.hasAttribute('data-para-img'),
          center: top + r.height / 2
        });
      });
    };
    collect();
    on(window, 'resize', collect);
    on(window, 'load', collect);
    let target = window.pageYOffset || 0, cur = target;
    loop(() => {
      target = window.pageYOffset || root.scrollTop || 0;
      cur += (target - cur) * 0.09;
      const mid = cur + window.innerHeight / 2;
      for (let i = 0; i < paras.length; i++) {
        const p = paras[i];
        const off = (mid - p.center) * p.speed;
        const t = 'translate3d(0,' + off.toFixed(2) + 'px,0)';
        p.el.style.transform = p.isImg ? t + ' scale(1.1)' : t;
      }
    });
  }

  /* ================= card tilt + sheen ================= */
  if (fine && !calm) {
    qsa('[data-tilt]').forEach(card => {
      on(card, 'mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        card.style.transform =
          'rotateX(' + ((0.5 - y) * 5).toFixed(2) + 'deg)' +
          ' rotateY(' + ((x - 0.5) * 7).toFixed(2) + 'deg)' +
          ' translateY(-4px)';
      });
      on(card, 'mouseleave', () => { card.style.transform = 'rotateX(0) rotateY(0) translateY(0)'; });
    });
  }

  /* ================= magnetic buttons ================= */
  if (fine && !calm) {
    qsa('.btn').forEach(b => {
      let r = null;
      on(b, 'mouseenter', () => { r = b.getBoundingClientRect(); b.style.transition = 'transform .18s ease-out, background .3s, box-shadow .3s'; });
      on(b, 'mousemove', e => {
        if (!r) r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        b.style.transform = 'translate(' + (dx * 10).toFixed(1) + 'px,' + (dy * 8 - 2).toFixed(1) + 'px)';
      });
      on(b, 'mouseleave', () => {
        b.style.transition = 'transform .5s cubic-bezier(.22,.75,.25,1), background .3s, box-shadow .3s';
        b.style.transform = '';
        r = null;
      });
    });
  }

  /* ================= custom cursor ================= */
  if (fine && !calm) {
    const dot = ce('div', 'cur');
    const ring = ce('div', 'cur-ring');
    const txt = ce('span', 'cur-txt');
    ring.appendChild(txt);
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(dot); doc.body.appendChild(ring);
    created.push(dot, ring);
    dot.style.opacity = ring.style.opacity = '0';
    let mx = -100, my = -100, dx = -100, dy = -100, rx = -100, ry = -100, seen = false;
    on(doc, 'mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (!seen) { seen = true; dx = rx = mx; dy = ry = my; dot.style.opacity = ring.style.opacity = '1'; }
    }, { passive: true });
    loop(() => {
      dx += (mx - dx) * 0.55; dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      dot.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translate(-50%,-50%)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
    });
    on(doc, 'mouseover', e => {
      if (!e.target || !e.target.closest) return;
      const lab = e.target.closest('[data-cursor]');
      if (lab) { txt.textContent = lab.getAttribute('data-cursor'); ring.classList.add('label'); ring.classList.remove('grow'); return; }
      if (e.target.closest('a, button, summary')) { ring.classList.add('grow'); ring.classList.remove('label'); }
    });
    on(doc, 'mouseout', e => {
      if (!e.target || !e.target.closest) return;
      if (e.target.closest('a, button, summary, [data-cursor]')) ring.classList.remove('grow', 'label');
    });
    on(doc, 'mousedown', () => ring.classList.add('down'));
    on(doc, 'mouseup', () => ring.classList.remove('down'));
    on(doc, 'mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
    on(doc, 'mouseenter', () => { if (seen) dot.style.opacity = ring.style.opacity = '1'; });
  }

  /* ================= page-transition veil ================= */
  const veil = ce('div', 'veil');
  veil.setAttribute('aria-hidden', 'true');
  const vm = ce('span', 'v-mark');
  vm.textContent = "Barbara's";
  veil.appendChild(vm);
  doc.body.appendChild(veil);
  created.push(veil);
  on(doc, 'click', e => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.target === '_blank') return;
    const href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    let url;
    try { url = new URL(href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return; /* same page anchor */
    e.preventDefault();
    if (calm) { location.href = url.href; return; }
    root.classList.add('leaving');
    setTimeout(() => { location.href = url.href; }, 560);
  });
  on(window, 'pageshow', e => { if (e.persisted) root.classList.remove('leaving'); });

  /* ================= championship drag strip ================= */
  const strip = qs('.champ-strip');
  if (strip) {
    const bar = qs('.champ-progress i');
    const setBar = () => {
      if (!bar) return;
      const m = strip.scrollWidth - strip.clientWidth;
      const p = m > 0 ? strip.scrollLeft / m : 0;
      bar.style.transform = 'scaleX(' + (0.08 + 0.92 * Math.max(0, Math.min(1, p))) + ')';
    };
    on(strip, 'scroll', setBar, { passive: true });
    on(window, 'resize', setBar);
    setBar();
    if (fine) {
      let down = false, sx = 0, sl = 0, moved = 0, vx = 0, lx = 0, lt = 0;
      on(strip, 'pointerdown', e => {
        if (e.pointerType !== 'mouse') return;
        down = true; moved = 0; sx = e.clientX; sl = strip.scrollLeft;
        lx = e.clientX; lt = performance.now(); vx = 0;
      });
      on(strip, 'pointermove', e => {
        if (!down) return;
        const d = e.clientX - sx;
        moved = Math.max(moved, Math.abs(d));
        if (moved > 8) {
          strip.classList.add('dragging');
          try { strip.setPointerCapture(e.pointerId); } catch (err) {}
        }
        strip.scrollLeft = sl - d;
        const n = performance.now();
        vx = (e.clientX - lx) / Math.max(n - lt, 1);
        lx = e.clientX; lt = n;
      });
      const end = () => {
        if (!down) return;
        down = false;
        strip.classList.remove('dragging');
        let v = vx * 14;
        const mom = () => {
          if (dead || down || Math.abs(v) < 0.4) return;
          strip.scrollLeft -= v; v *= 0.94;
          requestAnimationFrame(mom);
        };
        requestAnimationFrame(mom);
      };
      on(strip, 'pointerup', end);
      on(strip, 'pointercancel', end);
      on(strip, 'click', e => { if (moved > 8) { e.stopPropagation(); e.preventDefault(); } moved = 0; }, true);
    }
  }

  /* ================= lightbox ================= */
  const lb = qs('#lb');
  if (lb) {
    const lbImg = qs('#lb-img');
    const lbCap = qs('#lb-cap');
    const lbCnt = qs('#lb-count');
    const lbClose = qs('#lb-close');
    const prev = qs('.lb-prev');
    const next = qs('.lb-next');
    let items = [], idx = 0, lastFocus = null, openNow = false;
    const collect = () => {
      items = qsa('.tile-btn').filter(b => {
        const t = b.closest('.tile');
        return !t || !t.classList.contains('hide');
      }).map(b => {
        const img = qs('img', b);
        const cap = qs('.tile-cap', b);
        return { btn: b, src: img ? img.getAttribute('src') : '', alt: img ? img.alt : '', cap: (b.dataset && b.dataset.note) || (cap ? cap.textContent.trim() : '') };
      });
    };
    const paint = () => {
      const it = items[idx];
      if (!it) return;
      lbImg.style.opacity = '0';
      setTimeout(() => {
        if (dead) return;
        lbImg.onload = () => { lbImg.style.opacity = '1'; };
        lbImg.src = it.src; lbImg.alt = it.alt;
        if (lbImg.complete) lbImg.style.opacity = '1';
        if (lbCap) lbCap.textContent = it.cap;
        if (lbCnt) lbCnt.textContent = (idx + 1) + ' / ' + items.length;
        const pre = new Image(); pre.src = (items[(idx + 1) % items.length] || {}).src || '';
        const pre2 = new Image(); pre2.src = (items[(idx - 1 + items.length) % items.length] || {}).src || '';
      }, 140);
    };
    const openLb = i => {
      collect();
      idx = i; openNow = true;
      lb.classList.add('open');
      lastFocus = doc.activeElement;
      if (lbClose) lbClose.focus();
      paint();
    };
    const closeLb = () => {
      openNow = false;
      lb.classList.remove('open');
      lbImg.removeAttribute('src');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    const step = d => { if (!items.length) return; idx = (idx + d + items.length) % items.length; paint(); };
    qsa('.tile-btn').forEach(b => on(b, 'click', () => {
      collect();
      const i = items.findIndex(it => it.btn === b);
      openLb(i < 0 ? 0 : i);
    }));
    if (lbClose) on(lbClose, 'click', closeLb);
    if (prev) on(prev, 'click', e => { e.stopPropagation(); step(-1); });
    if (next) on(next, 'click', e => { e.stopPropagation(); step(1); });
    on(lb, 'click', e => { if (e.target === lb) closeLb(); });
    on(doc, 'keydown', e => {
      if (!openNow) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  }

  window.__bhSiteVer = 'v8';
  /* ================= flyer lightbox (Summer page) ================= */
  if (qs('.champ-strip')) {
    const ov = doc.createElement('div');
    ov.id = 'fly-lb';
    ov.style.cssText = 'position:fixed;inset:0;z-index:220;background:rgba(20,25,45,.92);display:none;align-items:center;justify-content:center;padding:3vh 3vw;cursor:zoom-out';
    ov.innerHTML = '<img style="max-width:100%;max-height:100%;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.5)" alt="Summer program flyer">' +
      '<button aria-label="Previous flyer" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.12);border:0;color:#fff;font-size:2rem;line-height:1;padding:.4rem .9rem;border-radius:999px;cursor:pointer">&#8249;</button>' +
      '<button aria-label="Next flyer" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.12);border:0;color:#fff;font-size:2rem;line-height:1;padding:.4rem .9rem;border-radius:999px;cursor:pointer">&#8250;</button>' +
      '<button aria-label="Close" style="position:absolute;top:14px;right:16px;background:none;border:0;color:#fff;font-size:2rem;cursor:pointer">&#215;</button>';
    doc.body.appendChild(ov);
    const im = qs('img', ov), btns = qsa('button', ov);
    let fi = 0, openF = false;
    const flyList = () => qsa('a.fly');
    const showF = i => {
      const flys = flyList();
      if (!flys.length) return;
      fi = (i + flys.length) % flys.length;
      im.src = flys[fi].getAttribute('href');
    };
    const openFly = i => { openF = true; ov.style.display = 'flex'; showF(i); };
    const closeFly = () => { openF = false; ov.style.display = 'none'; im.removeAttribute('src'); };
    on(doc, 'click', e => {
      if (!e.target || !e.target.closest) return;
      const a = e.target.closest('a.fly');
      if (!a) return;
      e.preventDefault(); e.stopPropagation();
      openFly(flyList().indexOf(a));
    });
    on(btns[0], 'click', e => { e.stopPropagation(); showF(fi - 1); });
    on(btns[1], 'click', e => { e.stopPropagation(); showF(fi + 1); });
    on(btns[2], 'click', e => { e.stopPropagation(); closeFly(); });
    on(ov, 'click', e => { if (e.target === ov || e.target === im) closeFly(); });
    on(doc, 'keydown', e => {
      if (!openF) return;
      if (e.key === 'Escape') closeFly();
      else if (e.key === 'ArrowLeft') showF(fi - 1);
      else if (e.key === 'ArrowRight') showF(fi + 1);
    });
  }

  /* ================= gallery filters ================= */
  const fbar = qs('#filters');
  if (fbar) {
    const MAP = {
      'Performing Company': 'company', 'Competition Team': 'company', 'Mini Team': 'company',
      'Junior Team': 'company', 'Senior Team': 'company', 'Junior Company': 'company',
      'Senior Company': 'company', 'Seniors': 'company',
      'Lyrical': 'lyrical', 'Contemporary': 'lyrical',
      'Jazz': 'jazz', 'Hip-Hop': 'jazz',
      'Ballet': 'ballet', 'Technique': 'ballet', 'Acro': 'ballet',
      'Tap': 'tap',
      'Tiny Dancers': 'young', 'First Recital': 'young', 'Young Dancers': 'young', 'Recital Day': 'young',
      'Duet': 'duets', 'Trio': 'duets'
    };
    const tiles = qsa('.tile');
    tiles.forEach(t => {
      const c = qs('.tile-cap', t);
      const key = c ? c.textContent.trim() : '';
      t.dataset.f = MAP[key] || 'other';
    });
    const count = qs('#fcount');
    const setCount = n => { if (count) count.textContent = n + (n === 1 ? ' photo' : ' photos'); };
    setCount(tiles.length);
    const apply = f => {
      let n = 0;
      tiles.forEach(t => {
        const show = f === 'all' || t.dataset.f === f;
        t.classList.toggle('hide', !show);
        if (show) {
          n++;
          t.classList.add('in');
          qsa('img.ir', t).forEach(i => i.classList.add('in'));
          t.classList.remove('tin');
          void t.offsetWidth;
          t.classList.add('tin');
        }
      });
      setCount(n);
    };
    qsa('.fbtn', fbar).forEach(b => on(b, 'click', () => {
      qsa('.fbtn', fbar).forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      apply(b.getAttribute('data-f') || 'all');
    }));
  }

  /* ================= nutcracker snow ================= */
  const snowCanvas = qs('canvas.snow');
  if (snowCanvas && opts.snow !== false && !calm) {
    const ctx = snowCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, flakes = [];
    const mk = init => ({
      x: Math.random() * W,
      y: init ? Math.random() * H : -8,
      r: 0.6 + Math.random() * 1.9,
      s: 0.22 + Math.random() * 0.65,
      a: 0.12 + Math.random() * 0.45,
      p: Math.random() * 6.28,
      w: 0.2 + Math.random() * 0.6
    });
    const size = () => {
      const host = snowCanvas.parentElement;
      if (!host) return;
      const r = host.getBoundingClientRect();
      W = r.width; H = r.height;
      snowCanvas.width = Math.max(1, W * dpr);
      snowCanvas.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(130, Math.max(46, Math.round(W * H / 16000)));
      flakes = [];
      for (let i = 0; i < n; i++) flakes.push(mk(true));
    };
    size();
    on(window, 'resize', size);
    let vis = true;
    const vio = io(es => { vis = es[0].isIntersecting; }, {});
    vio.observe(snowCanvas);
    let t = 0;
    loop(() => {
      if (!vis || doc.hidden) return;
      t += 0.008;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#FBFAF7';
      for (let i = 0; i < flakes.length; i++) {
        const k = flakes[i];
        k.y += k.s;
        k.x += Math.sin(t * 2 + k.p) * k.w * 0.4;
        if (k.y > H + 8) { flakes[i] = mk(false); continue; }
        ctx.globalAlpha = k.a;
        ctx.beginPath();
        ctx.arc(k.x, k.y, k.r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }

  /* ================= teardown ================= */
  const teardown = () => {
    dead = true;
    offs.forEach(f => { try { f(); } catch (e) {} });
    observers.forEach(o => { try { o.disconnect(); } catch (e) {} });
    created.forEach(n => { try { n.remove(); } catch (e) {} });
    root.classList.remove('leaving');
  };
  prevTeardown = teardown;
  return teardown;
}
