/**
 * Zoth Studio — Scroll Motion & Intersection Observer Engine (v2.0)
 */
(function(global) {
  'use strict';
  const ZothScrollMotion = {
    VERSION: '2.0.0',
    initScrollReveal(selector = '.card') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll(selector).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
      });
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothScrollMotion;
  else global.ZothScrollMotion = ZothScrollMotion;
})(typeof window !== 'undefined' ? window : globalThis);
