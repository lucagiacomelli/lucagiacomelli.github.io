/* ═══════════════════════════════════════════════════════════════
   SUBSCRIPTION — Stripe config + client-side state management
   ───────────────────────────────────────────────────────────────
   SETUP (one-time, ~5 minutes)
   ─────────────────────────────
   1. Go to dashboard.stripe.com → Products → Create a product
      Name: "AI × Business Insights"  |  Price: $19/month recurring
   2. Go to Payment Links → Create a link for that product
      Success URL: https://YOUR-DOMAIN/subscribe-success.html
   3. Paste the link URL into STRIPE_PAYMENT_LINK below
   4. (Optional) Go to Billing → Customer portal → Activate it
      Paste the portal URL into STRIPE_CUSTOMER_PORTAL below

   NOTE: This is a client-side-only integration (no backend).
   Access is stored in localStorage. It works well for a personal
   advisory site. For auto-revoke on cancellation, a small backend
   (e.g. a single Netlify Function webhook) can be added later.
═══════════════════════════════════════════════════════════════ */

const STRIPE_PAYMENT_LINK   = 'https://buy.stripe.com/YOUR_PAYMENT_LINK_HERE';
const STRIPE_CUSTOMER_PORTAL = 'https://billing.stripe.com/YOUR_PORTAL_LINK_HERE';
const SUBSCRIPTION_PRICE    = '$9.00 / month';
const SUBSCRIPTION_KEY      = 'lg_subscription_v1';
const SUBSCRIPTION_TTL_DAYS = 33; // slightly over 1 month, refreshed on each visit to success page

/* ── State helpers ───────────────────────────────────────────── */

function isSubscribed() {
  try {
    const raw = localStorage.getItem(SUBSCRIPTION_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return data.active === true && Date.now() < (data.expiry || 0);
  } catch (_) {
    return false;
  }
}

function setSubscribed() {
  const expiry = Date.now() + SUBSCRIPTION_TTL_DAYS * 86400 * 1000;
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify({ active: true, expiry }));
}

function clearSubscription() {
  localStorage.removeItem(SUBSCRIPTION_KEY);
}

/* ── URL helpers ─────────────────────────────────────────────── */

function getSubscribeUrl() {
  return STRIPE_PAYMENT_LINK;
}

function getPortalUrl() {
  return STRIPE_CUSTOMER_PORTAL;
}

/* ── Insight lock helpers ────────────────────────────────────── */

// Returns a sorted copy (newest first) with isFree flag
function getInsightsWithAccess() {
  const sorted = [...INSIGHTS].sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted.map((insight, index) => ({
    ...insight,
    isFree: index < FREE_INSIGHTS_COUNT,
    isLocked: index >= FREE_INSIGHTS_COUNT && !isSubscribed(),
  }));
}

function isInsightLocked(id) {
  const list = getInsightsWithAccess();
  const item = list.find(i => i.id === id);
  return item ? item.isLocked : false;
}
