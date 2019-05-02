var sm = require('sitemap');

var sitemapClient = function (data) {
  return sm.createSitemap({
    hostname: 'https://mannhowie.com',
    cacheTime: 600000,
    urls: data
  });
};

module.exports = sitemapClient