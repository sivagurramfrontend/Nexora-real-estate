/** Agents listing page — renders every agent as a large card. */
(function () {
  'use strict';
  var N = window.Nexora, data = window.NexoraData;
  function init() {
    var wrap = document.getElementById('agentGrid');
    if (wrap) { wrap.innerHTML = data.agents.map(function (a) { return N.agentCard(a, true); }).join(''); }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
