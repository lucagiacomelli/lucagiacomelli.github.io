/* ─────────────────────────────────────────
   MAIN.JS — nav scroll, scroll reveal,
             ticker pause on hover
   ───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAV: add .scrolled class past 40px ───
  const nav = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  // ─── SCROLL REVEAL via IntersectionObserver ───
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire once only
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  reveals.forEach(el => revealObserver.observe(el));


  // ─── TICKER: pause animation on hover ─────
  const tickerWrap  = document.querySelector('.ticker-wrap');
  const tickerTrack = document.querySelector('.ticker-track');

  if (tickerWrap && tickerTrack) {
    tickerWrap.addEventListener('mouseenter', () => {
      tickerTrack.style.animationPlayState = 'paused';
    });
    tickerWrap.addEventListener('mouseleave', () => {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

});
