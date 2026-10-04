/** Blog article page (blog-details.html?id=1) */
(function () {
  'use strict';
  var N = window.Nexora, data = window.NexoraData, esc = N.escapeHTML;

  function init() {
    var root = document.getElementById('article');
    var id = Number(N.query().get('id')) || 1;
    var post = data.posts.filter(function (p) { return p.id === id; })[0];
    if (!post) {
      root.innerHTML = '<div class="empty-state"><h2>Article not found</h2><a class="btn btn-primary" href="blog.html">Back to the blog</a></div>';
      return;
    }
    document.title = post.title + ' | Nexora Real Estate';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) { desc.setAttribute('content', post.excerpt); }
    var crumb = document.getElementById('crumbCurrent');
    if (crumb) { crumb.textContent = post.title; }

    root.innerHTML = '' +
      '<div class="article-cover"><img src="' + esc(post.image) + '" alt="" width="1200" height="800"></div>' +
      '<div class="article-meta">' + esc(post.category) + ' &middot; <time datetime="' + esc(post.date) + '">' + esc(N.formatDate(post.date)) + '</time></div>' +
      '<h1>' + esc(post.title) + '</h1>' +
      post.body.map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('');

    var recent = data.posts.filter(function (p) { return p.id !== post.id; }).slice(0, 4);
    document.getElementById('recentPosts').innerHTML = recent.map(function (p) {
      return '<li><a href="blog-details.html?id=' + p.id + '">' + esc(p.title) + '</a></li>';
    }).join('');
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
