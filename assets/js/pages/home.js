/**
 * Home pages (index.html and index-2.html)
 * Renders featured properties and agents, and handles the search form.
 */
(function () {
  'use strict';
  var N = window.Nexora, data = window.NexoraData;

  function renderFeatured() {
    var grid = document.getElementById('featuredGrid');
    if (!grid) { return; }
    grid.innerHTML = data.properties.filter(function (p) { return p.featured; }).map(N.propertyCard).join('');
  }

  function renderAgents() {
    var wrap = document.getElementById('homeAgents');
    if (!wrap) { return; }
    wrap.innerHTML = data.agents.map(function (a) { return N.agentCard(a, false); }).join('');
  }

  /** Buy / Rent toggle buttons. The active one is exposed with aria-pressed. */
  function bindTabs(form) {
    var tabs = N.$$('[data-search-status]', form);
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === tab)); });
      });
    });
  }

  /** Sends the search criteria to properties.html as URL parameters. */
  function bindSearch() {
    var form = document.getElementById('homeSearch');
    if (!form) { return; }
    bindTabs(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var active = N.$('[data-search-status][aria-pressed="true"]', form);
      var params = new URLSearchParams();
      params.set('status', active ? active.getAttribute('data-search-status') : 'Sale');
      var location = document.getElementById('homeLocation').value.trim();
      var type = document.getElementById('homeType').value;
      var beds = document.getElementById('homeBeds').value;
      var price = document.getElementById('homePrice').value;
      if (location) { params.set('location', location); }
      if (type) { params.set('type', type); }
      if (beds) { params.set('beds', beds); }
      if (price) {
        var range = price.split('-');
        params.set('min', range[0]);
        params.set('max', range[1]);
      }
      window.location.href = 'properties.html?' + params.toString();
    });
  }

  function init() {
    renderFeatured();
    renderAgents();
    bindSearch();
    N.syncFavoriteUI();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
