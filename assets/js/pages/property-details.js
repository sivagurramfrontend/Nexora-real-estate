/**
 * Property detail page (property-details.html?id=1)
 * Builds the page from NexoraData, including gallery, lightbox, map,
 * mortgage calculator, enquiry form and similar listings.
 */
(function () {
  'use strict';
  var N = window.Nexora, data = window.NexoraData;
  var esc = N.escapeHTML;

  var root = document.getElementById('propertyDetail');
  var property, agent, currentImage = 0;

  /* ---------- Page template ---------- */
  function template(p, a) {
    var saved = N.isFavorite(p.id);
    return '' +
    '<section class="section"><div class="container">' +
      '<div class="detail">' +
        '<div>' +
          '<div class="gallery-main">' +
            '<img id="galleryImage" src="' + esc(p.images[0]) + '" alt="' + esc(p.title) + ' — photo 1 of ' + p.images.length + '" width="1200" height="800">' +
            '<button class="btn btn-light" id="openImage" type="button">' + N.icon('maximize') + ' Fullscreen</button>' +
          '</div>' +
          '<div class="gallery-side" id="thumbs">' +
            p.images.map(function (src, i) {
              return '<button type="button" data-index="' + i + '" aria-label="Show photo ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '>' +
                     '<img src="' + esc(src) + '" alt="" width="300" height="200" loading="lazy"></button>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<aside class="detail-panel" aria-label="Property summary">' +
          '<span class="tag">For ' + esc(p.status) + '</span>' +
          '<h1>' + esc(p.title) + '</h1>' +
          '<div class="price">' + N.formatPrice(p.price, p.status) + '</div>' +
          '<div class="location">' + N.icon('map-pin') + esc(p.address) + ', ' + esc(p.location) + '</div>' +
          '<div class="specs">' +
            '<div class="spec"><strong>' + (p.beds || '—') + '</strong>Bedrooms</div>' +
            '<div class="spec"><strong>' + (p.baths || '—') + '</strong>Bathrooms</div>' +
            '<div class="spec"><strong>' + Number(p.area).toLocaleString('en-US') + '</strong>Sq Ft</div>' +
            '<div class="spec"><strong>' + p.year + '</strong>Year</div>' +
          '</div>' +
          '<div class="detail-actions">' +
            '<button class="btn btn-primary" type="button" data-favorite="' + p.id + '" aria-pressed="' + saved + '">' + N.icon('heart') + ' <span data-fav-label>' + (saved ? 'Saved' : 'Save property') + '</span></button>' +
            '<button class="btn btn-outline" id="shareBtn" type="button">' + N.icon('share') + ' Share</button>' +
          '</div>' +
          '<hr class="divider">' +
          '<div class="agent-box">' +
            '<img src="' + esc(a.image) + '" alt="' + esc(a.name) + '" width="72" height="72">' +
            '<div><strong>' + esc(a.name) + '</strong><div class="location">' + esc(a.role) + '</div>' +
            '<a class="text-link" href="agent-details.html?id=' + a.id + '">View agent ' + N.icon('arrow-right') + '</a></div>' +
          '</div>' +
        '</aside>' +
      '</div>' +

      '<div class="content-grid">' +
        '<div>' +
          '<article class="content-card">' +
            '<h2>Property description</h2><p>' + esc(p.description) + '</p>' +
            '<h2>Amenities</h2><ul class="amenities">' +
              p.amenities.map(function (x) { return '<li>' + N.icon('check') + esc(x) + '</li>'; }).join('') +
            '</ul>' +
            '<h2>Location</h2><div class="map" id="propertyMap" role="region" aria-label="Map showing ' + esc(p.title) + '"></div>' +
          '</article>' +
        '</div>' +
        '<div>' +
          '<section class="content-card" aria-labelledby="enquiryTitle">' +
            '<h2 id="enquiryTitle">Ask about this property</h2>' +
            '<form data-validate data-success="Thanks! Your enquiry has been captured. Connect this form to your own backend before publishing." novalidate>' +
              '<div class="form-grid">' +
                '<div class="form-field full"><label for="enqName">Name <span class="req" aria-hidden="true">*</span></label><input id="enqName" name="name" autocomplete="name" required></div>' +
                '<div class="form-field full"><label for="enqEmail">Email <span class="req" aria-hidden="true">*</span></label><input id="enqEmail" name="email" type="email" autocomplete="email" required></div>' +
                '<div class="form-field full"><label for="enqMessage">Message <span class="req" aria-hidden="true">*</span></label><textarea id="enqMessage" name="message" minlength="10" required>I am interested in ' + esc(p.title) + '. Please send me more details.</textarea></div>' +
                '<div class="hp-field" aria-hidden="true"><label>Leave empty <input name="website" tabindex="-1" autocomplete="off"></label></div>' +
                '<div class="form-field full"><button class="btn btn-primary" type="submit">Send enquiry</button></div>' +
              '</div>' +
              '<div class="form-message" role="status" aria-live="polite"></div>' +
            '</form>' +
          '</section>' +
          (p.status === 'Sale' ? calculatorTemplate(p) : '') +
        '</div>' +
      '</div>' +

      '<div class="mt-5"><div class="section-head"><div><h2>Similar properties</h2><p>More listings you may like</p></div></div>' +
        '<div class="property-list" id="similar"></div></div>' +
    '</div></section>';
  }

  function calculatorTemplate(p) {
    return '' +
      '<section class="content-card mt-3" aria-labelledby="calcTitle">' +
        '<h2 id="calcTitle">Mortgage calculator</h2>' +
        '<form class="calc" id="calc" novalidate>' +
          '<div class="form-field"><label for="calcPrice">Property price ($)</label><input id="calcPrice" type="number" min="0" value="' + p.price + '"></div>' +
          '<div class="form-field"><label for="calcDown">Down payment (%)</label><input id="calcDown" type="number" min="0" max="90" value="20"></div>' +
          '<div class="form-field"><label for="calcRate">Interest rate (% per year)</label><input id="calcRate" type="number" min="0" max="25" step="0.1" value="6.5"></div>' +
          '<div class="form-field"><label for="calcYears">Loan term (years)</label><input id="calcYears" type="number" min="1" max="40" value="30"></div>' +
          '<div class="calc-result" role="status" aria-live="polite"><strong id="calcOut">$0</strong><span>estimated per month</span></div>' +
          '<p class="field-hint">Estimate only. It excludes taxes, insurance and fees.</p>' +
        '</form>' +
      '</section>';
  }

  /* ---------- Behaviour ---------- */
  function setImage(index) {
    var total = property.images.length;
    currentImage = (index + total) % total;
    var img = document.getElementById('galleryImage');
    img.src = property.images[currentImage];
    img.alt = property.title + ' — photo ' + (currentImage + 1) + ' of ' + total;
    N.$$('#thumbs button').forEach(function (b, i) {
      if (i === currentImage) { b.setAttribute('aria-current', 'true'); } else { b.removeAttribute('aria-current'); }
    });
    var light = document.getElementById('lightboxImage');
    if (light) { light.src = property.images[currentImage]; light.alt = img.alt; }
  }

  function bindGallery() {
    document.getElementById('thumbs').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-index]');
      if (btn) { setImage(Number(btn.getAttribute('data-index'))); }
    });
    document.getElementById('openImage').addEventListener('click', function (e) {
      setImage(currentImage);
      N.openModal(document.getElementById('lightbox'), e.currentTarget);
    });
    document.getElementById('galleryImage').addEventListener('click', function () { document.getElementById('openImage').click(); });
    N.$$('[data-lightbox-step]').forEach(function (btn) {
      btn.addEventListener('click', function () { setImage(currentImage + Number(btn.getAttribute('data-lightbox-step'))); });
    });
    document.addEventListener('keydown', function (e) {
      if (!N.$('#lightbox.open')) { return; }
      if (e.key === 'ArrowRight') { setImage(currentImage + 1); }
      if (e.key === 'ArrowLeft') { setImage(currentImage - 1); }
    });
  }

  function bindShare() {
    document.getElementById('shareBtn').addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).then(
          function () { N.toast('Property link copied'); },
          function () { N.toast('Copy the page address to share this property'); }
        );
      } else {
        N.toast('Copy the page address to share this property');
      }
    });
  }

  /** Standard fixed-rate mortgage payment formula. */
  function bindCalculator() {
    var form = document.getElementById('calc');
    if (!form) { return; }
    function calc() {
      var price = Number(document.getElementById('calcPrice').value) || 0;
      var down = Math.min(90, Math.max(0, Number(document.getElementById('calcDown').value) || 0));
      var rate = (Number(document.getElementById('calcRate').value) || 0) / 100 / 12;
      var months = (Number(document.getElementById('calcYears').value) || 0) * 12;
      var loan = price * (1 - down / 100);
      var payment = 0;
      if (months > 0) { payment = rate === 0 ? loan / months : loan * rate / (1 - Math.pow(1 + rate, -months)); }
      document.getElementById('calcOut').textContent = '$' + Math.round(payment).toLocaleString('en-US');
    }
    form.addEventListener('input', calc);
    form.addEventListener('submit', function (e) { e.preventDefault(); calc(); });
    calc();
  }

  function renderSimilar() {
    var list = data.properties.filter(function (p) { return p.id !== property.id && (p.type === property.type || p.status === property.status); }).slice(0, 3);
    document.getElementById('similar').innerHTML = list.map(N.propertyCard).join('');
  }

  function setMeta(p) {
    document.title = p.title + ' | Nexora Real Estate';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) { desc.setAttribute('content', p.title + ' in ' + p.location + '. ' + p.description); }
    var crumb = document.getElementById('crumbCurrent');
    if (crumb) { crumb.textContent = p.title; }
  }

  function init() {
    var id = Number(N.query().get('id')) || 1;
    property = data.properties.filter(function (p) { return p.id === id; })[0];
    if (!property) {
      root.innerHTML = '<section class="section"><div class="container"><div class="empty-state"><h2>Property not found</h2><p>This listing may have been removed.</p><a class="btn btn-primary" href="properties.html">Browse all properties</a></div></div></section>';
      return;
    }
    agent = data.agents.filter(function (a) { return a.id === property.agentId; })[0] || data.agents[0];
    root.innerHTML = template(property, agent);
    setMeta(property);
    bindGallery();
    bindShare();
    bindCalculator();
    renderSimilar();
    N.initMap('propertyMap', property.lat, property.lng, property.title);
    N.syncFavoriteUI();
    // Form validation was bound before this markup existed, so bind the new form too.
    document.dispatchEvent(new CustomEvent('nexora:rebind-forms'));
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
