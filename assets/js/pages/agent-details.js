/** Agent profile page (agent-details.html?id=1) */
(function () {
  'use strict';
  var N = window.Nexora, data = window.NexoraData, esc = N.escapeHTML;

  function init() {
    var root = document.getElementById('agentDetail');
    var id = Number(N.query().get('id')) || 1;
    var a = data.agents.filter(function (x) { return x.id === id; })[0];
    if (!a) {
      root.innerHTML = '<section class="section"><div class="container"><div class="empty-state"><h2>Agent not found</h2><a class="btn btn-primary" href="agents.html">View all agents</a></div></div></section>';
      return;
    }
    var props = data.properties.filter(function (p) { return p.agentId === a.id; });
    document.title = a.name + ' | Nexora Real Estate';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) { desc.setAttribute('content', a.name + ', ' + a.role + ' in ' + a.location + '. ' + a.bio); }
    var crumb = document.getElementById('crumbCurrent');
    if (crumb) { crumb.textContent = a.name; }

    root.innerHTML = '' +
      '<section class="section"><div class="container">' +
        '<div class="agent-detail">' +
          '<div class="agent-detail-photo"><img src="' + esc(a.image) + '" alt="Portrait of ' + esc(a.name) + '" width="400" height="500"></div>' +
          '<div class="agent-meta">' +
            '<span class="tag">' + esc(a.role) + '</span>' +
            '<h1>' + esc(a.name) + '</h1>' +
            '<div class="location">' + N.icon('map-pin') + esc(a.location) + '</div>' +
            '<p>' + esc(a.bio) + '</p>' +
            '<h2 class="mt-3 subhead">Specialties</h2>' +
            '<div class="flex-wrap">' + a.specialties.map(function (s) { return '<span class="tag">' + esc(s) + '</span>'; }).join('') + '</div>' +
            '<div class="content-card mt-3"><h2>Contact</h2>' +
              '<p><strong>Phone:</strong> <a class="text-link" href="tel:' + esc(a.phone.replace(/\s/g, '')) + '">' + esc(a.phone) + '</a></p>' +
              '<p><strong>Email:</strong> <a class="text-link" href="mailto:' + esc(a.email) + '">' + esc(a.email) + '</a></p>' +
              '<a class="btn btn-primary" href="contact.html?agent=' + encodeURIComponent(a.name) + '">Contact ' + esc(a.name.split(' ')[0]) + '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="mt-5"><div class="section-head"><div><h2>Listings by ' + esc(a.name.split(' ')[0]) + '</h2><p>Properties managed by this agent</p></div></div>' +
          '<div class="property-list">' + (props.length ? props.map(N.propertyCard).join('') : '<div class="empty-state">No listings assigned yet.</div>') + '</div></div>' +
      '</div></section>';
    N.syncFavoriteUI();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
