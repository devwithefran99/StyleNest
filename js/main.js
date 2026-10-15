/* ==========================================================================
   main.js
   Builds the whole page from window.SITE (js/config.js).
   Only Bootstrap is needed. If it fails to load, product click opens
   WhatsApp directly, so ordering still works.
   ========================================================================== */
(function () {
  'use strict';

  const S = window.SITE;
  if (!S) { console.error('[landing] js/config.js did not load'); return; }

  const doc = document;
  const root = doc.documentElement;
  root.classList.add('js');

  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const hasBS = typeof window.bootstrap !== 'undefined';

  const brand = S.brand || {};
  const contact = S.contact || {};
  const copy = S.copy || {};
  const products = S.products || [];
  const collections = S.collections || [];
  const byId = {};
  products.forEach((p) => { byId[p.id] = p; });
  const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const money = (n) => (S.currency || '') + Number(n).toLocaleString('en-US');
  const setHTML = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; return el; };
  const tel = (v) => String(v || '').replace(/[^+\d]/g, '');
  const pageUrl = () => window.location.href.split('#')[0];

  const waNumber = String(contact.whatsapp || '').replace(/\D/g, '');
  const waLink = (text) => (waNumber
    ? 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(text || '')
    : '#contact');

  function orderLink(p, size) {
    const tpl = S.orderMessage || 'Hello {brand}, I want to order {product} ({size}) {price} {url}';
    const vals = {
      brand: brand.name, product: p.name, size: size || 'to be confirmed',
      price: money(p.price), url: pageUrl()
    };
    return waLink(tpl.replace(/\{(\w+)\}/g, (m, k) => (vals[k] !== undefined ? vals[k] : m)));
  }

  /* ---------- Theme from config ---------- */
  function hexToRgb(hex) {
    let h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function applyTheme() {
    const accent = (S.theme || {}).accent || '#111111';
    const rgb = hexToRgb(accent);
    let onAccent = '#ffffff';
    if (rgb) {
      const lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
      onAccent = lum > 0.6 ? '#111111' : '#ffffff';
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--on-accent', onAccent);
    }
    root.style.setProperty('--logo-h', (brand.logoHeight || 28) + 'px');

    const seo = S.seo || {};
    doc.title = seo.title || [brand.name, brand.tagline].filter(Boolean).join(' | ');
    const md = $('meta[name="description"]');
    if (md) md.setAttribute('content', seo.description || '');

    let icon = $('link[rel="icon"]');
    if (!icon) { icon = doc.createElement('link'); icon.rel = 'icon'; doc.head.appendChild(icon); }
    if (brand.favicon) {
      icon.href = brand.favicon;
    } else {
      const letter = esc((brand.name || 'B').trim().charAt(0).toUpperCase());
      const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='" +
        accent + "'/><text x='32' y='45' font-family='Arial,sans-serif' font-size='38' font-weight='700' text-anchor='middle' fill='" +
        onAccent + "'>" + letter + '</text></svg>';
      icon.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    }
  }

  /* ---------- Small builders ---------- */
  const brandHTML = () => (brand.logo
    ? '<img src="' + esc(brand.logo) + '" alt="' + esc(brand.name) + '">'
    : '<span class="brand-text">' + esc(brand.name) + '</span>');

  const photo = (p, lazy) => (p.img
    ? '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '"' + (lazy ? ' loading="lazy"' : '') + ' decoding="async">'
    : '<span class="no-photo"><i class="bi bi-image"></i></span>');

  const sectionHead = (h) => (h
    ? '<h2 class="section-title">' + esc(h.title) + '</h2>' + (h.text ? '<p class="section-sub">' + esc(h.text) + '</p>' : '')
    : '');

  const catName = (id) => (collections.find((c) => c.id === id) || {}).name || '';

  /* ---------- Render: header, hero ---------- */
  function renderShell() {
    const bar = $('#topbar');
    if (bar && S.announcement) { bar.textContent = S.announcement; bar.hidden = false; }

    setHTML('#navBrand', brandHTML());
    setHTML('#menuBrand', brandHTML());

    const nav = S.nav || [];
    setHTML('#navLinks', nav.map((l) => '<a href="' + esc(l.href) + '">' + esc(l.label) + '</a>').join(''));
    setHTML('#menuLinks', nav.map((l) => '<a href="' + esc(l.href) + '"><span>' + esc(l.label) + '</span><i class="bi bi-arrow-up-right"></i></a>').join(''));

    const hello = waLink('Hello ' + (brand.name || '') + ', I have a question.');
    ['#navWa', '#fabWa'].forEach((sel) => { const a = $(sel); if (a) a.href = hello; });
    if (!waNumber) { const a = $('#navWa'); if (a) a.hidden = true; const f = $('#fabWa'); if (f) f.hidden = true; }

    const mc = [];
    if (contact.phone) mc.push('<a href="tel:' + esc(tel(contact.phone)) + '"><i class="bi bi-telephone"></i>' + esc(contact.phone) + '</a>');
    if (contact.email) mc.push('<a href="mailto:' + esc(contact.email) + '"><i class="bi bi-envelope"></i>' + esc(contact.email) + '</a>');
    setHTML('#menuContact', mc.join(''));

    const h = S.hero || {};
    setHTML('#heroEyebrow', esc(h.eyebrow || ''));
    setHTML('#heroTitle', esc(h.title || brand.name || ''));
    setHTML('#heroSub', esc(h.text || ''));

    const cta = [];
    if (h.primary) cta.push('<a class="btn-solid" href="' + esc(h.primary.href) + '">' + esc(h.primary.label) + '<i class="bi bi-arrow-right"></i></a>');
    if (h.secondary) {
      const isWa = h.secondary.href === 'whatsapp';
      cta.push('<a class="btn-line" href="' + esc(isWa ? hello : h.secondary.href) + '"' + (isWa ? ' target="_blank" rel="noopener"' : '') + '><i class="bi bi-whatsapp"></i>' + esc(h.secondary.label) + '</a>');
    }
    setHTML('#heroCta', cta.join(''));
    setHTML('#heroPoints', (h.points || []).map((p) => '<li><i class="bi ' + esc(p.icon) + '"></i>' + esc(p.text) + '</li>').join(''));

    const media = $('#heroMedia');
    if (media) {
      if (h.image) media.innerHTML = '<img src="' + esc(h.image) + '" alt="' + esc(brand.name) + ' collection" fetchpriority="high">';
      else media.parentElement.hidden = true;
    }
  }

  /* ---------- Render: collections ---------- */
  function renderCollections() {
    setHTML('#collectionsHead', sectionHead(copy.collections));
    setHTML('#collectionGrid', collections.map((c) => {
      const items = products.filter((p) => p.category === c.id);
      const cover = c.img ? { img: c.img, name: c.name } : (items.find((p) => p.img) || { name: c.name });
      return '<div class="col-6 col-lg-3"><a class="collection" href="#shop" data-filter="' + esc(c.id) + '" aria-label="' + esc(c.name) + ', ' + items.length + ' pieces">' +
        photo(cover, true) +
        '<span class="collection-label"><strong>' + esc(c.name) + '</strong><small>' + items.length + '</small><i class="bi bi-arrow-up-right"></i></span></a></div>';
    }).join(''));
  }

  /* ---------- Render: shop, filters, modal ---------- */
  let activeFilter = 'all';

  function productCard(p, i) {
    const tag = p.badge ? '<span class="badge-tag' + (/sale/i.test(p.badge) ? ' is-sale' : '') + '">' + esc(p.badge) + '</span>' : '';
    return '<div class="col-6 col-md-4 col-xl-3"><article class="product pop" style="animation-delay:' + Math.min(i, 11) * 0.04 + 's" data-open="' + esc(p.id) + '" tabindex="0" role="button" aria-label="' + esc(p.name) + ', ' + esc(money(p.price)) + '">' +
      '<div class="product-media">' + tag + photo(p, true) + '<span class="quick-view">Quick view</span></div>' +
      '<div class="product-info"><h3 class="product-name">' + esc(p.name) + '</h3>' +
      '<div class="price"><b>' + esc(money(p.price)) + '</b>' + (p.oldPrice ? '<s>' + esc(money(p.oldPrice)) + '</s>' : '') + '</div></div></article></div>';
  }

  function renderProducts() {
    const list = activeFilter === 'all' ? products : products.filter((p) => p.category === activeFilter);
    setHTML('#productGrid', list.map(productCard).join(''));
    setHTML('#shopCount', list.length + (list.length === 1 ? ' piece' : ' pieces'));
  }

  function renderShop() {
    setHTML('#shopHead', sectionHead(copy.shop));
    const chips = [{ id: 'all', name: 'All' }].concat(collections);
    setHTML('#filters', chips.map((c) =>
      '<button type="button" class="chip' + (c.id === 'all' ? ' is-active' : '') + '" data-chip="' + esc(c.id) + '" role="tab" aria-selected="' + (c.id === 'all') + '">' + esc(c.name) + '</button>'
    ).join(''));
    renderProducts();
  }

  function setFilter(id) {
    activeFilter = id;
    $$('.chip').forEach((c) => {
      const on = c.dataset.chip === id;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', String(on));
    });
    renderProducts();
  }

  let modal = null;
  let current = null;
  let currentSize = '';

  function updateOrder() {
    const a = $('#pmOrder');
    if (a && current) a.href = orderLink(current, currentSize);
  }

  function openProduct(id) {
    const p = byId[id];
    if (!p) return;
    current = p;
    const sizes = p.sizes || DEFAULT_SIZES;
    currentSize = sizes[Math.min(1, sizes.length - 1)];

    setHTML('#pmMedia', photo(p, false));
    setHTML('#pmCat', esc(catName(p.category)));
    setHTML('#pmTitle', esc(p.name));
    setHTML('#pmPrice', '<b>' + esc(money(p.price)) + '</b>' + (p.oldPrice ? '<s>' + esc(money(p.oldPrice)) + '</s>' : ''));
    setHTML('#pmDesc', esc(p.desc || S.defaultDescription || ''));
    setHTML('#pmSizes', sizes.map((s) =>
      '<button type="button" class="size' + (s === currentSize ? ' is-active' : '') + '" data-size="' + esc(s) + '" role="radio" aria-checked="' + (s === currentSize) + '">' + esc(s) + '</button>'
    ).join(''));

    const call = $('#pmCall');
    if (call) {
      if (contact.phone) { call.href = 'tel:' + tel(contact.phone); call.hidden = false; } else { call.hidden = true; }
    }
    const order = $('#pmOrder');
    if (order) order.hidden = !waNumber;
    updateOrder();

    if (hasBS) {
      if (!modal) modal = new window.bootstrap.Modal($('#productModal'));
      modal.show();
    } else if (waNumber) {
      window.open(orderLink(p, currentSize), '_blank', 'noopener');
    }
  }

  /* ---------- Render: perks, reviews, contact, footer ---------- */
  function renderPerks() {
    setHTML('#perksHead', sectionHead(copy.perks));
    setHTML('#perkGrid', (S.perks || []).map((p) =>
      '<div class="col-6 col-lg-3"><div class="perk"><i class="bi ' + esc(p.icon) + '"></i><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p></div></div>'
    ).join(''));
  }

  function renderReviews() {
    const t = S.testimonials || {};
    const sec = $('#reviews');
    if (!sec) return;
    if (!t.enabled || !(t.items || []).length) { sec.hidden = true; return; }
    sec.hidden = false;
    setHTML('#reviewsHead', sectionHead(copy.reviews));
    setHTML('#reviewGrid', t.items.map((r) => {
      const stars = '<i class="bi bi-star-fill"></i>'.repeat(Math.max(0, Math.min(5, r.rating || 5)));
      return '<div class="col-md-6 col-lg-4"><figure class="review"><div class="stars">' + stars + '</div><p>' + esc(r.text) + '</p><small>' + esc(r.name) + (r.place ? ', ' + esc(r.place) : '') + '</small></figure></div>';
    }).join(''));
  }

  function renderContact() {
    const c = copy.cta || {};
    setHTML('#ctaTitle', esc(c.title || ''));
    setHTML('#ctaText', esc(c.text || ''));
    const acts = [];
    if (waNumber) acts.push('<a class="btn-solid" href="' + esc(waLink('Hello ' + (brand.name || '') + ', I would like to place an order.')) + '" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i>Chat on WhatsApp</a>');
    if (contact.phone) acts.push('<a class="btn-line" href="tel:' + esc(tel(contact.phone)) + '"><i class="bi bi-telephone"></i>Call us</a>');
    if (contact.email) acts.push('<a class="btn-line" href="mailto:' + esc(contact.email) + '"><i class="bi bi-envelope"></i>Email</a>');
    if (contact.messenger) acts.push('<a class="btn-line" href="https://m.me/' + esc(contact.messenger) + '" target="_blank" rel="noopener"><i class="bi bi-messenger"></i>Messenger</a>');
    setHTML('#ctaActions', acts.join(''));
  }

  function renderFooter() {
    const social = Object.assign({}, S.social || {});
    if (waNumber) social.whatsapp = 'https://wa.me/' + waNumber;
    const icons = { facebook: 'bi-facebook', instagram: 'bi-instagram', youtube: 'bi-youtube', tiktok: 'bi-tiktok', x: 'bi-twitter-x', linkedin: 'bi-linkedin', whatsapp: 'bi-whatsapp' };
    const socials = Object.keys(social).filter((k) => social[k] && icons[k]).map((k) =>
      '<a class="btn-round" href="' + esc(social[k]) + '" target="_blank" rel="noopener" aria-label="' + esc(k) + '"><i class="bi ' + icons[k] + '"></i></a>'
    ).join('');

    setHTML('#footerBrand', '<a class="brand" href="#top">' + brandHTML() + '</a><p>' + esc((S.footer || {}).about || brand.tagline || '') + '</p><div class="socials">' + socials + '</div>');
    setHTML('#footerShop', '<h4>Shop</h4>' + collections.map((c) => '<a href="#shop" data-filter="' + esc(c.id) + '">' + esc(c.name) + '</a>').join(''));
    setHTML('#footerHelp', '<h4>Help</h4>' + ((S.footer || {}).help || []).map((l) => '<a href="' + esc(l.href) + '">' + esc(l.label) + '</a>').join(''));

    const ci = [];
    if (contact.address) ci.push('<span class="line-item"><i class="bi bi-geo-alt"></i>' + esc(contact.address) + '</span>');
    if (contact.phone) ci.push('<a href="tel:' + esc(tel(contact.phone)) + '"><i class="bi bi-telephone"></i>' + esc(contact.phone) + '</a>');
    if (contact.email) ci.push('<a href="mailto:' + esc(contact.email) + '"><i class="bi bi-envelope"></i>' + esc(contact.email) + '</a>');
    setHTML('#footerContact', '<h4>Contact</h4>' + ci.join(''));

    setHTML('#footerBottom', '<span>&copy; ' + new Date().getFullYear() + ' ' + esc(brand.name || '') + '. All rights reserved.</span><span>' + esc(brand.tagline || '') + '</span>');
  }

  /* ---------- Behaviour ---------- */
  function scrollToHash(hash) {
    const target = hash === '#top' ? $('#top') : $(hash);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function initReveal() {
    const els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach((el) => io.observe(el));
    // Safety: never leave content hidden
    setTimeout(() => els.forEach((el) => el.classList.add('is-in')), 3500);
  }

  function initNavShadow() {
    const nav = $('#siteNav');
    if (!nav) return;
    const on = () => nav.classList.toggle('is-scrolled', window.pageYOffset > 8);
    window.addEventListener('scroll', on, { passive: true });
    on();
  }

  function initEvents() {
    doc.addEventListener('click', (e) => {
      const filterLink = e.target.closest('[data-filter]');
      if (filterLink) {
        e.preventDefault();
        const menu = filterLink.closest('#menu');
        if (menu && hasBS) window.bootstrap.Offcanvas.getInstance(menu).hide();
        setFilter(filterLink.dataset.filter);
        scrollToHash('#shop');
        return;
      }

      const chip = e.target.closest('[data-chip]');
      if (chip) { setFilter(chip.dataset.chip); return; }

      const size = e.target.closest('[data-size]');
      if (size) {
        currentSize = size.dataset.size;
        $$('#pmSizes .size').forEach((b) => {
          const on = b === size;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-checked', String(on));
        });
        updateOrder();
        return;
      }

      const opener = e.target.closest('[data-open]');
      if (opener) { e.preventDefault(); openProduct(opener.dataset.open); return; }

      const a = e.target.closest('a[href^="#"]');
      if (a) {
        const h = a.getAttribute('href');
        e.preventDefault();
        if (!h || h === '#') return;
        const menu = a.closest('#menu');
        if (menu && hasBS) {
          const oc = window.bootstrap.Offcanvas.getInstance(menu);
          menu.addEventListener('hidden.bs.offcanvas', () => scrollToHash(h), { once: true });
          oc.hide();
        } else {
          scrollToHash(h);
        }
      }
    });

    doc.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.product')) {
        e.preventDefault();
        openProduct(e.target.dataset.open);
      }
    });
  }

  /* ---------- Boot ---------- */
  applyTheme();
  renderShell();
  renderCollections();
  renderShop();
  renderPerks();
  renderReviews();
  renderContact();
  renderFooter();
  initEvents();
  initNavShadow();
  initReveal();
})();
