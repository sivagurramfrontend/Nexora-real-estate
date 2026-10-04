/** Contact page — prefills the subject from the URL and shows the office map. */
(function () {
  'use strict';
  var N = window.Nexora;

  function init() {
    var q = N.query();
    var subject = document.getElementById('subject');
    if (subject && q.get('property')) { subject.value = 'Enquiry: ' + q.get('property'); }
    if (subject && q.get('agent')) { subject.value = 'Contact: ' + q.get('agent'); }
    N.initMap('officeMap', 40.7527, -73.9772, 'Nexora Real Estate office');
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
