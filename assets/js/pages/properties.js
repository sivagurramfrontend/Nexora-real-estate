/**
 * Properties listing page
 * Filtering, sorting, grid/list view and pagination. The current filters are
 * kept in the URL so results can be bookmarked or shared.
 */
(function () {
  'use strict';
  var N = window.Nexora, data = window.NexoraData;

  var PAGE_SIZE = 6;
  var FIELDS = ['status', 'location', 'type', 'min', 'max', 'beds', 'sort'];
  var state = { page: 1 };

  var grid = document.getElementById('propertyGrid');
  var count = document.getElementById('count');
  var pager = document.getElementById('pagination');
  var form = document.getElementById('filters');

  function el(id) { return document.getElementById(id); }

  /** Returns the filtered + sorted list of properties. */
  function getResults() {
    var status = el('status').value;
    var loc = el('location').value.trim().toLowerCase();
    var type = el('type').value;
    var min = Number(el('min').value) || 0;
    var max = Number(el('max').value) || Infinity;
    var beds = Number(el('beds').value) || 0;
    var sort = el('sort').value;

    var list = data.properties.filter(function (p) {
      return (!status || p.status === status) &&
             (!loc || p.location.toLowerCase().indexOf(loc) !== -1) &&
             (!type || p.type === type) &&
             p.price >= min && p.price <= max &&
             (!beds || p.beds >= beds);
    });

    if (sort === 'low') { list.sort(function (a, b) { return a.price - b.price; }); }
    else if (sort === 'high') { list.sort(function (a, b) { return b.price - a.price; }); }
    else { list.sort(function (a, b) { return b.year - a.year || b.id - a.id; }); }
    return list;
  }

  /** Writes the current filters into the address bar (no page reload). */
  function syncUrl() {
    var params = new URLSearchParams();
    FIELDS.forEach(function (key) {
      var value = el(key).value;
      if (value && !(key === 'sort' && value === 'newest')) { params.set(key, value); }
    });
    if (state.page > 1) { params.set('page', state.page); }
    var qs = params.toString();
    try { window.history.replaceState(null, '', qs ? '?' + qs : window.location.pathname); } catch (e) { /* file:// in some browsers */ }
  }

  function renderPager(totalPages) {
    if (totalPages <= 1) { pager.innerHTML = ''; return; }
    var html = '<button type="button" data-page="' + (state.page - 1) + '" aria-label="Previous page"' + (state.page === 1 ? ' disabled' : '') + '>' + N.icon('arrow-left') + '</button>';
    for (var i = 1; i <= totalPages; i++) {
      html += '<button type="button" data-page="' + i + '" aria-label="Page ' + i + '"' + (i === state.page ? ' aria-current="page"' : '') + '>' + i + '</button>';
    }
    html += '<button type="button" data-page="' + (state.page + 1) + '" aria-label="Next page"' + (state.page === totalPages ? ' disabled' : '') + '>' + N.icon('arrow-right') + '</button>';
    pager.innerHTML = html;
  }

  function render() {
    var results = getResults();
    var totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    if (state.page > totalPages) { state.page = totalPages; }
    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = results.slice(start, start + PAGE_SIZE);

    count.textContent = results.length + ' propert' + (results.length === 1 ? 'y' : 'ies') + ' found';

    if (pageItems.length) {
      grid.innerHTML = pageItems.map(N.propertyCard).join('');
    } else {
      grid.innerHTML = '<div class="empty-state"><h3>No properties match your filters</h3><p>Try widening the price range or removing a filter.</p>' +
        '<button class="btn btn-outline" type="button" id="emptyReset">Reset filters</button></div>';
    }
    renderPager(totalPages);
    syncUrl();
    N.syncFavoriteUI();
  }

  function reset() { form.reset(); state.page = 1; render(); }

  function bindView() {
    var buttons = N.$$('[data-view]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var list = btn.getAttribute('data-view') === 'list';
        grid.classList.toggle('is-list', list);
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      });
    });
  }

  function init() {
    // Fill the form from the URL, e.g. properties.html?type=Villa&beds=3
    var q = N.query();
    FIELDS.forEach(function (key) { if (q.get(key) !== null) { el(key).value = q.get(key); } });
    state.page = Math.max(1, Number(q.get('page')) || 1);

    form.addEventListener('submit', function (e) { e.preventDefault(); state.page = 1; render(); });
    ['status', 'type', 'beds', 'sort'].forEach(function (key) { el(key).addEventListener('change', function () { state.page = 1; render(); }); });
    el('resetFilters').addEventListener('click', reset);

    // Delegated clicks for pagination and the "reset" button in the empty state
    document.addEventListener('click', function (e) {
      var pageBtn = e.target.closest('[data-page]');
      if (pageBtn && !pageBtn.disabled) {
        state.page = Number(pageBtn.getAttribute('data-page'));
        render();
        document.getElementById('results').scrollIntoView();
      }
      if (e.target.id === 'emptyReset') { reset(); }
    });

    bindView();
    render();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
