/** Favorites page — shows the properties saved in localStorage. */
(function () {
  'use strict';
  var N = window.Nexora, data = window.NexoraData;

  function render() {
    var grid = document.getElementById('favoritesGrid');
    var ids = N.getFavorites();
    var saved = data.properties.filter(function (p) { return ids.indexOf(p.id) !== -1; });
    document.getElementById('favCountText').textContent = saved.length + ' saved propert' + (saved.length === 1 ? 'y' : 'ies');
    grid.innerHTML = saved.length
      ? saved.map(N.propertyCard).join('')
      : '<div class="empty-state"><h3>No saved properties yet</h3><p>Tap the heart on any listing to save it here.</p><a class="btn btn-primary" href="properties.html">Browse properties</a></div>';
    N.syncFavoriteUI();
  }

  function init() {
    render();
    document.addEventListener('nexora:favorites-changed', render);  // removing a card updates the list
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
