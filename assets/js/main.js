/**
 * Nexora — core script (loaded on every page)
 * ---------------------------------------------------------------------------
 * Provides the shared `Nexora` helper object and wires up behaviour that is
 * common to all pages: mobile navigation, favorites, modals, form validation,
 * back-to-top button and the footer year.
 *
 * Page-specific code lives in assets/js/pages/.
 */
(function () {
  'use strict';

  /* -----------------------------------------------------------------------
   * Small DOM helpers
   * --------------------------------------------------------------------- */
  function $(selector, root) { return (root || document).querySelector(selector); }
  function $$(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  /* -----------------------------------------------------------------------
   * Safe localStorage wrapper
   * Browsers can throw when storage is blocked (private mode, strict
   * cookie settings), so every read/write is wrapped in try/catch and
   * falls back to an in-memory object.
   * --------------------------------------------------------------------- */
  var memoryStore = {};
  var storage = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : fallback;
      }
    },
    set: function (key, value) {
      memoryStore[key] = value;
      try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    }
  };

  /* -----------------------------------------------------------------------
   * Formatting helpers
   * --------------------------------------------------------------------- */
  /** Escapes a value so it is safe to place inside innerHTML. */
  function escapeHTML(value) {
    return String(value === undefined || value === null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /** Formats a price. Rentals get a "/ month" suffix. */
  function formatPrice(price, status) {
    var text = '$' + Number(price).toLocaleString('en-US');
    return status === 'Rent' ? text + ' / month' : text;
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  /** Reads the URL query string into a URLSearchParams object. */
  function query() { return new URLSearchParams(window.location.search); }

  /** Returns an inline SVG icon (see assets/js/icons.js). */
  function icon(name) {
    var inner = (window.NexoraIcons && window.NexoraIcons[name]) || '';
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  /* -----------------------------------------------------------------------
   * Toast notification
   * --------------------------------------------------------------------- */
  var toastTimer;
  function toast(message) {
    var el = $('#toast');
    if (!el) { return; }
    el.textContent = message;
    el.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { el.classList.remove('show'); }, 2400);
  }

  /* -----------------------------------------------------------------------
   * Favorites (saved to localStorage under "nexoraFavorites")
   * --------------------------------------------------------------------- */
  var FAV_KEY = 'nexoraFavorites';

  function getFavorites() {
    var list = storage.get(FAV_KEY, []);
    return Array.isArray(list) ? list : [];
  }
  function isFavorite(id) { return getFavorites().indexOf(Number(id)) !== -1; }

  function toggleFavorite(id) {
    id = Number(id);
    var list = getFavorites();
    var index = list.indexOf(id);
    if (index === -1) { list.push(id); } else { list.splice(index, 1); }
    storage.set(FAV_KEY, list);
    syncFavoriteUI();
    document.dispatchEvent(new CustomEvent('nexora:favorites-changed', { detail: { id: id, saved: index === -1 } }));
    return index === -1;
  }

  /** Updates every heart button and counter on the page to match storage. */
  function syncFavoriteUI() {
    var list = getFavorites();
    $$('[data-favorite]').forEach(function (btn) {
      var saved = list.indexOf(Number(btn.getAttribute('data-favorite'))) !== -1;
      btn.setAttribute('aria-pressed', String(saved));
      var title = btn.getAttribute('data-title');
      if (title) { btn.setAttribute('aria-label', (saved ? 'Remove ' : 'Save ') + title + (saved ? ' from favorites' : ' to favorites')); }
      var label = $('[data-fav-label]', btn);
      if (label) { label.textContent = saved ? 'Saved' : 'Save property'; }
    });
    $$('[data-fav-count]').forEach(function (el) { el.textContent = list.length; });
  }

  /* -----------------------------------------------------------------------
   * Shared HTML templates (used by several pages)
   * --------------------------------------------------------------------- */
  function propertyCard(p) {
    var saved = isFavorite(p.id);
    var url = 'property-details.html?id=' + p.id;
    return '' +
      '<article class="card">' +
        '<a class="property-img" href="' + url + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + escapeHTML(p.image) + '" alt="" width="600" height="400" loading="lazy">' +
        '</a>' +
        '<span class="badge">For ' + escapeHTML(p.status) + '</span>' +
        '<button class="heart" type="button" data-favorite="' + p.id + '" data-title="' + escapeHTML(p.title) + '" aria-pressed="' + saved + '" ' +
          'aria-label="' + (saved ? 'Remove ' : 'Save ') + escapeHTML(p.title) + (saved ? ' from favorites' : ' to favorites') + '">' + icon('heart') + '</button>' +
        '<div class="card-body">' +
          '<div class="price">' + formatPrice(p.price, p.status) + '</div>' +
          '<h3 class="card-title"><a href="' + url + '">' + escapeHTML(p.title) + '</a></h3>' +
          '<div class="location">' + icon('map-pin') + escapeHTML(p.location) + '</div>' +
          '<p class="card-excerpt">' + escapeHTML(p.description) + '</p>' +
          '<div class="meta">' +
            (p.beds ? '<span>' + icon('bed') + p.beds + ' Beds</span>' : '') +
            (p.baths ? '<span>' + icon('bath') + p.baths + ' Baths</span>' : '') +
            '<span>' + icon('area') + Number(p.area).toLocaleString('en-US') + ' Sq Ft</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function agentCard(a, large) {
    var url = 'agent-details.html?id=' + a.id;
    return '' +
      '<article class="agent">' +
        '<a href="' + url + '" tabindex="-1" aria-hidden="true"><img class="agent-img" src="' + escapeHTML(a.image) + '" alt="" width="400" height="500" loading="lazy"></a>' +
        '<div class="agent-info">' +
          '<b><a href="' + url + '">' + escapeHTML(a.name) + '</a></b>' +
          '<small>' + escapeHTML(a.role) + '</small>' +
          (large ? '<small>' + escapeHTML(a.location) + '</small>' : '') +
        '</div>' +
      '</article>';
  }

  function blogCard(post) {
    var url = 'blog-details.html?id=' + post.id;
    return '' +
      '<article class="blog-card">' +
        '<a class="blog-img" href="' + url + '" tabindex="-1" aria-hidden="true"><img src="' + escapeHTML(post.image) + '" alt="" width="600" height="400" loading="lazy"></a>' +
        '<div class="blog-body">' +
          '<small>' + escapeHTML(post.category) + ' &middot; ' + escapeHTML(formatDate(post.date)) + '</small>' +
          '<h3><a href="' + url + '">' + escapeHTML(post.title) + '</a></h3>' +
          '<p>' + escapeHTML(post.excerpt) + '</p>' +
          '<a class="text-link" href="' + url + '">Read article ' + icon('arrow-right') + '</a>' +
        '</div>' +
      '</article>';
  }

  /* -----------------------------------------------------------------------
   * Modals (video, lightbox) with focus management
   * --------------------------------------------------------------------- */
  var lastTrigger = null;
  function openModal(modal, trigger) {
    if (!modal) { return; }
    lastTrigger = trigger || document.activeElement;
    modal.classList.add('open');
    var focusTarget = $('[data-close-modal]', modal);
    if (focusTarget) { focusTarget.focus(); }
  }
  function closeModal(modal) {
    if (!modal) { return; }
    modal.classList.remove('open');
    if (lastTrigger && lastTrigger.focus) { lastTrigger.focus(); }
  }

  function bindModals() {
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-modal]');
      if (opener) { openModal(document.getElementById(opener.getAttribute('data-open-modal')), opener); return; }
      var closer = e.target.closest('[data-close-modal]');
      if (closer) { closeModal(closer.closest('.modal')); return; }
      if (e.target.classList && e.target.classList.contains('modal')) { closeModal(e.target); }
    });
    document.addEventListener('keydown', function (e) {
      var modal = $('.modal.open');
      if (!modal) { return; }
      if (e.key === 'Escape') { closeModal(modal); return; }
      if (e.key === 'Tab') { // keep keyboard focus inside the open modal
        var items = $$('button, a[href], input, select, textarea', modal).filter(function (el) { return !el.disabled; });
        if (!items.length) { return; }
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* -----------------------------------------------------------------------
   * Form validation
   * Add `data-validate` to a <form>. Supports: required, type=email,
   * type=tel, type=number (min/max), minlength, and a custom message via
   * data-error="...". Success text comes from data-success="...".
   * --------------------------------------------------------------------- */
  function fieldError(field) {
    if (field.type === 'checkbox' && field.required && !field.checked) { return 'Please tick this box to continue.'; }
    var value = (field.value || '').trim();
    if (field.required && !value) { return field.getAttribute('data-error') || 'This field is required.'; }
    if (!value) { return ''; }
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) { return 'Enter a valid email address, for example name@example.com.'; }
    if (field.type === 'tel' && !/^[+()\d\s.-]{7,20}$/.test(value)) { return 'Enter a valid phone number (digits, spaces, + and - only).'; }
    if (field.type === 'number') {
      var n = Number(value);
      if (isNaN(n)) { return 'Enter a number.'; }
      if (field.min !== '' && n < Number(field.min)) { return 'Enter a value of ' + field.min + ' or more.'; }
      if (field.max !== '' && n > Number(field.max)) { return 'Enter a value of ' + field.max + ' or less.'; }
    }
    if (field.minLength > 0 && value.length < field.minLength) { return 'Enter at least ' + field.minLength + ' characters.'; }
    return '';
  }

  function showFieldError(field, message) {
    var wrap = field.closest('.form-field') || field.parentNode;
    var errId = (field.id || field.name) + '-error';
    var err = document.getElementById(errId);
    if (!err) {
      err = document.createElement('div');
      err.className = 'field-error';
      err.id = errId;
      wrap.appendChild(err);
    }
    err.textContent = message;
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', errId);
    } else {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
  }

  function bindForms() {
    $$('form[data-validate]').forEach(function (form) {
      if (form.getAttribute('data-bound')) { return; }   // already wired up
      form.setAttribute('data-bound', 'true');
      form.setAttribute('novalidate', 'novalidate');
      var fields = $$('input, select, textarea', form).filter(function (f) { return f.type !== 'submit' && f.type !== 'hidden' && !f.closest('.hp-field'); });

      fields.forEach(function (field) {
        // On blur only flag fields the visitor actually typed in. "Required" errors wait for submit,
        // so an error message never pushes the Submit button away mid-click.
        field.addEventListener('blur', function () { if ((field.value || '').trim()) { showFieldError(field, fieldError(field)); } });
        field.addEventListener('input', function () { if (field.getAttribute('aria-invalid')) { showFieldError(field, fieldError(field)); } });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstInvalid = null;
        fields.forEach(function (field) {
          var message = fieldError(field);
          showFieldError(field, message);
          if (message && !firstInvalid) { firstInvalid = field; }
        });
        var box = $('.form-message', form.parentNode) || $('.form-message', form);
        if (firstInvalid) {
          if (box) { box.textContent = 'Please fix the highlighted fields and try again.'; box.className = 'form-message error show'; }
          firstInvalid.focus();
          return;
        }
        var trap = $('.hp-field input', form);   // honeypot: bots fill it, people never see it
        if (trap && trap.value) { return; }
        if (box) {
          box.textContent = form.getAttribute('data-success') || 'Thank you! Your message has been captured. Connect this form to your own backend before publishing.';
          box.className = 'form-message success show';
        }
        form.reset();
        document.dispatchEvent(new CustomEvent('nexora:form-sent', { detail: { form: form } }));
      });
    });
  }

  /* -----------------------------------------------------------------------
   * Maps (Leaflet + OpenStreetMap tiles)
   * Shows a friendly message if Leaflet or the network is unavailable.
   * --------------------------------------------------------------------- */
  function initMap(elementId, lat, lng, label) {
    var el = document.getElementById(elementId);
    if (!el) { return null; }
    if (!window.L) {
      el.innerHTML = '<div class="map-fallback">The map could not be loaded. Check your internet connection.</div>';
      return null;
    }
    window.L.Icon.Default.prototype.options.imagePath = 'assets/vendor/leaflet/images/';
    var map = window.L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 14);
    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    window.L.marker([lat, lng], { title: label || '' }).addTo(map).bindPopup(escapeHTML(label || ''));
    return map;
  }

  /* -----------------------------------------------------------------------
   * Common page behaviour
   * --------------------------------------------------------------------- */
  function bindNavigation() {
    var btn = $('.menu-btn');
    var nav = $('.nav-links');
    if (!btn || !nav) { return; }
    function setOpen(open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    }
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 768) { setOpen(false); } });
  }

  function bindBackToTop() {
    var btn = $('.to-top');
    if (!btn) { return; }
    window.addEventListener('scroll', function () { btn.classList.toggle('show', window.scrollY > 600); }, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
  }

  function init() {
    bindNavigation();
    bindModals();
    bindForms();
    bindBackToTop();
    // Pages that build forms with JavaScript ask for validation to be attached.
    document.addEventListener('nexora:rebind-forms', bindForms);

    // One delegated listener handles every heart button, including ones created later.
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-favorite]');
      if (!btn) { return; }
      e.preventDefault();
      var saved = toggleFavorite(btn.getAttribute('data-favorite'));
      toast(saved ? 'Property saved to favorites' : 'Property removed from favorites');
    });

    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    syncFavoriteUI();
  }

  /* -----------------------------------------------------------------------
   * Public API
   * --------------------------------------------------------------------- */
  window.Nexora = {
    $: $, $$: $$, storage: storage, query: query, icon: icon, toast: toast,
    escapeHTML: escapeHTML, formatPrice: formatPrice, formatDate: formatDate,
    getFavorites: getFavorites, isFavorite: isFavorite, toggleFavorite: toggleFavorite, syncFavoriteUI: syncFavoriteUI,
    propertyCard: propertyCard, agentCard: agentCard, blogCard: blogCard,
    openModal: openModal, closeModal: closeModal, initMap: initMap
  };

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
