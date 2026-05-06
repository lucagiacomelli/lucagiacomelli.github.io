/* ═══════════════════════════════════════════════════════════════
   INSIGHTS DATA — single source of truth
   ───────────────────────────────────────────────────────────────
   HOW TO PUBLISH A NEW INSIGHT
   ────────────────────────────
   1. Create the article HTML file in /insights/  (e.g. insights/my-new-post.html)
      → Add  data-insight-id="my-new-post"  to the <body> tag
   2. Add a new object to the INSIGHTS array below (newest first)
   3. That's it — the homepage, listing page, and paywall all update automatically

   FREE vs LOCKED
   ──────────────
   The FREE_INSIGHTS_COUNT most-recent insights are always free.
   All older ones require a subscription. No manual tagging needed.
═══════════════════════════════════════════════════════════════ */

const FREE_INSIGHTS_COUNT = 5;

const INSIGHTS = [

  // {
  //   id:          'pe-ai-distribution',
  //   title:       'OpenAI Didn\'t Raise $10 Billion. It Bought a Sales Force.',
  //   tag:         'strategy',
  //   tagLabel:    'Strategy',
  //   excerpt:     'The Deployment Company isn\'t a funding round — it\'s a distribution strategy. Why private equity is now AI\'s most efficient go-to-market channel, and what that means for every company in their portfolio.',
  //   date:        '2026-05-06',
  //   dateDisplay: 'May 2026',
  //   readTime:    '8 min read',
  //   url:         'insights/pe-ai-distribution.html',
  //   thumb:       'insights/images/pe-ai-distribution-thumb.svg',
  //   hasDemo:     true,
  //   miniDemo:    false,
  // },
  // {
  //   id:          'llm-unit-economics',
  //   title:       'LLM Prices Crashed 80% in Two Years. Here\'s What That Does to Your Business Model.',
  //   tag:         'economics',
  //   tagLabel:    'Economics',
  //   excerpt:     'Cheaper inference sounds like great news. But the implications for gross margin and competitive strategy are more complex than they appear.',
  //   date:        '2026-05-04',
  //   dateDisplay: 'May 2026',
  //   readTime:    '8 min read',
  //   url:         'insights/llm-unit-economics.html',
  //   hasDemo:     true,
  //   miniDemo:    true,
  // },

  // {
  //   id:          'ai-football-transfers',
  //   title:       'The €80M Gamble Is Now a Science — How AI Scouting Is Rewriting the Transfer Market',
  //   tag:         'football',
  //   tagLabel:    'Football × AI',
  //   excerpt:     'Football transfers are a €6.5B market built on gut instinct. AI valuation models, player radars, and VAEP metrics are turning the biggest gamble in sport into a repeatable process.',
  //   date:        '2026-05-07',
  //   dateDisplay: 'May 2026',
  //   readTime:    '9 min read',
  //   url:         'insights/ai-football-transfers.html',
  //   hasDemo:     true,
  //   miniDemo:    false,
  // },
  // {
  //   id:          'ai-football-revenue',
  //   title:       'The Fan Worth €1,200 — How AI Is Turning 500 Million Supporters Into Predictable Revenue',
  //   tag:         'football',
  //   tagLabel:    'Football × AI',
  //   excerpt:     'Football has 3.5 billion fans. Most clubs monetise 2% of them. AI personalisation, churn prediction, and dynamic pricing are changing that equation — fast.',
  //   date:        '2026-05-06',
  //   dateDisplay: 'May 2026',
  //   readTime:    '8 min read',
  //   url:         'insights/ai-football-revenue.html',
  //   hasDemo:     true,
  //   miniDemo:    false,
  // },
  {
    id:          'ai-hormuz-routing',
    title:       'The Strait Shuts. The Algorithms Adapt.',
    tag:         'technology',
    tagLabel:    'Technology',
    excerpt:     'When Hormuz closed in March 2026, maritime AI processed 1.2 billion AIS signals daily to reroute global trade in real time. The technical architecture — and the business logic — behind the fastest supply chain pivot in history.',
    date:        '2026-05-07',
    dateDisplay: 'May 2026',
    readTime:    '9 min read',
    url:         'insights/ai-hormuz-routing.html',
    thumb:       'insights/images/ai-hormuz-routing-thumb.svg',
    hasDemo:     false,
    miniDemo:    false,
  },
  {
    id:          'ai-football-injury',
    title:       'Your Hamstring Was Warning You Three Weeks Ago. AI Knows.',
    tag:         'football',
    tagLabel:    'Football × AI',
    excerpt:     'GPS vests. Muscle oxygen sensors. 500+ data points per session. Machine learning models are predicting football injuries before players feel a thing — and the business case is unambiguous.',
    date:        '2026-05-05',
    dateDisplay: 'May 2026',
    readTime:    '9 min read',
    url:         'insights/ai-football-injury.html',
    hasDemo:     true,
    miniDemo:    false,
  },
  {
    id:          'build-vs-buy',
    title:       'OpenAI Is Buying What It Can\'t Build Fast Enough. Here\'s What That Means for You.',
    tag:         'strategy',
    tagLabel:    'Strategy',
    excerpt:     'Six acquisitions in four months. Anthropic betting on compute instead. What their diverging strategies reveal about the most important AI decision your company faces.',
    date:        '2026-04-03',
    dateDisplay: 'Apr 2026',
    readTime:    '7 min read',
    url:         'insights/build-vs-buy.html',
    hasDemo:     false,
    miniDemo:    false,
  },
  {
    id:          'ai-agents-moat',
    title:       'AI Agents Are Everywhere. But 94% of Companies Are Worried — Here\'s Why.',
    tag:         'architecture',
    tagLabel:    'Architecture',
    excerpt:     'Gartner says 40% of enterprise apps will have AI agents by 2026. Yet most deployments are creating sprawl, not advantage. The reason is almost always architectural.',
    date:        '2026-03-02',
    dateDisplay: 'Mar 2026',
    readTime:    '8 min read',
    url:         'insights/ai-agents-moat.html',
    hasDemo:     false,
    miniDemo:    false,
  },
];
