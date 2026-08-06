/* ═══════════════════════════════════════════════════════════════
   PAYWALL — gates locked article pages
   Depends on: data/insights.js, js/subscription.js
   Usage: add  data-insight-id="your-insight-id"  to <body>
═══════════════════════════════════════════════════════════════ */

(function () {
  const insightId = document.body.dataset.insightId;
  if (!insightId) return;

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function () {
    // Populate article meta from insights.js data
    const insight = (typeof INSIGHTS !== 'undefined') && INSIGHTS.find(i => i.id === insightId);
    if (insight) {
      const tagEl      = document.querySelector('.article-tag');
      const dateEl     = document.querySelector('.article-date');
      const readTimeEl = document.querySelector('.article-read-time');
      if (tagEl)      { tagEl.className = 'article-tag tag-' + insight.tag; tagEl.textContent = insight.tagLabel; }
      if (dateEl)     dateEl.textContent = insight.dateDisplay;
      if (readTimeEl) readTimeEl.textContent = insight.readTime;
    }

    if (!isInsightLocked(insightId)) return; // free or subscribed — do nothing

    const body = document.querySelector('.article-body');
    if (!body) return;

    // Find the cut point: after the 2nd paragraph
    const paragraphs = body.querySelectorAll('p');
    const cutAfter   = paragraphs[1] || paragraphs[0];
    if (!cutAfter) return;

    // Wrap everything after cut point in a gated div
    const gated = document.createElement('div');
    gated.className = 'gated-content';

    const siblings = [];
    let   node     = cutAfter.nextSibling;
    while (node) {
      siblings.push(node);
      node = node.nextSibling;
    }
    siblings.forEach(n => gated.appendChild(n));
    body.appendChild(gated);

    // Inject paywall overlay BEFORE the gated div (sibling, not child)
    // This way the card appears immediately at the cut point — no scrolling needed
    const overlay = document.createElement('div');
    overlay.className = 'paywall-overlay';
    overlay.innerHTML = `
      <div class="paywall-card">
        <div class="paywall-lock">🔒</div>
        <h2>This insight is for subscribers</h2>
        <p>
          The ${FREE_INSIGHTS_COUNT} most recent insights are always free.
          Subscribe to unlock the full archive and every future piece.
        </p>
        <div class="paywall-price">${SUBSCRIPTION_PRICE}</div>
        <a href="../subscribe.html" class="paywall-btn-primary">Subscribe to read</a>
        <a href="../subscribe.html#restore" class="paywall-btn-secondary">
          Already subscribed? Restore access
        </a>
      </div>`;
    body.insertBefore(overlay, gated);
  });
})();
