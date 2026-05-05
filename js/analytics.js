/* ═══════════════════════════════════════════════════════════════
   ANALYTICS — Google Analytics 4
   ───────────────────────────────────────────────────────────────
   HOW TO ACTIVATE
   ───────────────
   1. Go to https://analytics.google.com
   2. Create a new property → get your Measurement ID (G-XXXXXXXXXX)
   3. Replace the GA_ID value below with your real ID
   4. That's it — all page views, geography, and demo events are
      tracked automatically across every page.
═══════════════════════════════════════════════════════════════ */

const GA_ID = 'G-FVEP635PZE'; // ← replace with your Measurement ID

/* ── LOAD GA4 SCRIPT ──────────────────────────────────────────── */
(function () {
  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') return; // don't fire until configured
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
})();

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', GA_ID, {
  // Anonymise IPs for GDPR friendliness
  anonymize_ip: true,
  // Send page_view automatically
  send_page_view: true,
});

/* ── HELPERS ──────────────────────────────────────────────────── */
const _engagedDemos = new Set();

function _send(eventName, params) {
  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') return;
  if (typeof gtag === 'undefined') return;
  gtag('event', eventName, params || {});
}

/** Call from any demo on first meaningful interaction */
function trackDemoEngaged(demoName) {
  if (_engagedDemos.has(demoName)) return;
  _engagedDemos.add(demoName);
  _send('demo_engaged', { demo_name: demoName });
}

/** Call on each individual interaction */
function trackDemo(demoName, action, label) {
  trackDemoEngaged(demoName); // idempotent first-touch
  _send('demo_interaction', {
    demo_name: demoName,
    action:    action,
    label:     label || '',
  });
}

// Expose globally so inline scripts can call them too
window.trackDemo        = trackDemo;
window.trackDemoEngaged = trackDemoEngaged;

/* ── AUTO-ATTACH DEMO TRACKING ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  // ── 1. INJURY RISK DEMO ──────────────────────────────────────
  ['s-load', 's-matches', 's-sleep', 's-sprint'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function () {
        trackDemo('injury_risk', 'slider', id);
      });
    }
  });

  // ── 2. FAN REVENUE DEMO ─────────────────────────────────────
  // Uses .tog-btn with data-group / data-val attributes
  document.querySelectorAll('.tog-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      trackDemo('fan_revenue', btn.dataset.group || 'toggle', btn.dataset.val || '');
    });
  });

  // ── 3. PLAYER VALUE (TRANSFER) DEMO ─────────────────────────
  // Position selector buttons
  document.querySelectorAll('.pos-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      trackDemo('player_value', 'position', btn.dataset.pos || '');
    });
  });
  // Sliders are rendered dynamically — use event delegation on container
  var demoControls = document.getElementById('demo-controls');
  if (demoControls) {
    demoControls.addEventListener('input', function (e) {
      if (e.target && e.target.type === 'range') {
        trackDemo('player_value', 'slider', 'stat_' + (e.target.dataset.idx || ''));
      }
    });
  }

  // ── 4. LLM UNIT ECONOMICS DEMO ──────────────────────────────
  var modelSelect = document.getElementById('model-select');
  if (modelSelect) {
    modelSelect.addEventListener('change', function () {
      trackDemo('llm_economics', 'model_change', modelSelect.options[modelSelect.selectedIndex].text.split(' — ')[0]);
    });
  }
  ['mau', 'queries', 'input-tokens', 'output-tokens'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function () {
        trackDemo('llm_economics', 'slider', id);
      });
    }
  });
  var monthlyPrice = document.getElementById('monthly-price');
  if (monthlyPrice) {
    monthlyPrice.addEventListener('input', function () {
      trackDemo('llm_economics', 'price_input', '');
    });
  }
  var priceDropToggle = document.getElementById('price-drop-toggle');
  if (priceDropToggle) {
    priceDropToggle.addEventListener('change', function () {
      trackDemo('llm_economics', 'scenario_toggle', priceDropToggle.checked ? 'price_drop_on' : 'price_drop_off');
    });
  }

  // ── 5. PAYWALL TRACKING ──────────────────────────────────────
  var insightId = (document.body && document.body.dataset.insightId) || 'unknown';

  function attachPaywallTracking(overlay) {
    _send('paywall_shown', { insight_id: insightId });
    // Track clicks on any CTA inside the overlay
    overlay.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', function () {
        _send('subscribe_click', {
          insight_id: insightId,
          cta_text:   el.textContent.trim().slice(0, 50),
        });
      });
    });
  }

  // Paywall may already be in the DOM (injected synchronously by paywall.js)
  var existingOverlay = document.querySelector('.paywall-overlay');
  if (existingOverlay) {
    attachPaywallTracking(existingOverlay);
  } else {
    // Watch for it being added dynamically
    var pwObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1 && node.classList && node.classList.contains('paywall-overlay')) {
            attachPaywallTracking(node);
            pwObserver.disconnect();
          }
        });
      });
    });
    pwObserver.observe(document.body, { childList: true, subtree: true });
  }

  // ── 6. CTA / EMAIL CLICK TRACKING ────────────────────────────
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
    el.addEventListener('click', function () {
      _send('contact_click', { source: window.location.pathname });
    });
  });

  // Track "Let's talk" and primary CTA button clicks
  document.querySelectorAll('.btn-primary, .btn-white, .btn-outline-white, .article-footer-cta a').forEach(function (el) {
    el.addEventListener('click', function () {
      _send('cta_click', {
        cta_text: el.textContent.trim().slice(0, 50),
        source:   window.location.pathname,
      });
    });
  });

  // ── 7. SCROLL DEPTH ON ARTICLES ──────────────────────────────
  // Fires once when visitor reaches 50% and 90% of article body
  var articleBody = document.querySelector('.article-body');
  if (articleBody) {
    var milestones = { 50: false, 90: false };
    window.addEventListener('scroll', function () {
      var rect = articleBody.getBoundingClientRect();
      var total = articleBody.offsetHeight;
      var scrolled = window.innerHeight - rect.top;
      if (total <= 0) return;
      var pct = Math.round((scrolled / total) * 100);
      [50, 90].forEach(function (m) {
        if (!milestones[m] && pct >= m) {
          milestones[m] = true;
          _send('article_scroll_depth', {
            insight_id: insightId,
            depth_pct:  m,
          });
        }
      });
    }, { passive: true });
  }

});
