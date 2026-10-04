/** Blog listing page — renders posts, with optional ?category= filter. */
(function () {
  'use strict';
  var N = window.Nexora, data = window.NexoraData, esc = N.escapeHTML;

  function init() {
    var grid = document.getElementById('blogGrid');
    var filters = document.getElementById('blogFilters');
    var active = N.query().get('category') || '';

    var categories = [];
    data.posts.forEach(function (p) { if (categories.indexOf(p.category) === -1) { categories.push(p.category); } });
    filters.innerHTML = ['All'].concat(categories).map(function (c) {
      var value = c === 'All' ? '' : c;
      return '<button class="tab" type="button" data-category="' + esc(value) + '" aria-pressed="' + (value === active) + '">' + esc(c) + '</button>';
    }).join('');

    function render() {
      var posts = data.posts.filter(function (p) { return !active || p.category === active; });
      grid.innerHTML = posts.map(N.blogCard).join('');
      N.$$('[data-category]', filters).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-category') === active)); });
    }
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-category]');
      if (!btn) { return; }
      active = btn.getAttribute('data-category');
      render();
    });
    render();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
