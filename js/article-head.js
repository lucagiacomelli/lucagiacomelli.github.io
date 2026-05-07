/**
 * article-head.js
 * Shared <head> assets for all insight article pages.
 *
 * Injects: Google Fonts, base/article/paywall CSS, analytics, and favicons.
 * Each page still owns its own <title>, <meta description/keywords>, canonical,
 * Open Graph, and Twitter Card tags, plus any page-specific CSS/scripts.
 *
 * Include with a plain (non-deferred) script tag:
 *   <script src="../js/article-head.js"></script>
 */
document.write(
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap" rel="stylesheet">' +
  '<link rel="stylesheet" href="../css/base.css">' +
  '<link rel="stylesheet" href="../css/article.css">' +
  '<link rel="stylesheet" href="../css/paywall.css">' +
  '<script src="../js/analytics.js"><\/script>' +
  '<link rel="icon" type="image/svg+xml" href="../favicon.svg">' +
  '<link rel="icon" type="image/x-icon" href="../favicon.ico">' +
  '<link rel="apple-touch-icon" href="../apple-touch-icon.png">'
);
