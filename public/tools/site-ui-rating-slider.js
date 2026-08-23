/**
 * Zoth Studio — NPS rating slider with confetti explosion. (v2.0)
 */
(function(global) {
  'use strict';
  const ZothRatingSlider = {
    VERSION: '2.0.0',
    submitRating(val) {
      console.log('[ZothRatingSlider] Invoked submitRating(val)');
      return true;
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothRatingSlider;
  else global.ZothRatingSlider = ZothRatingSlider;
})(typeof window !== 'undefined' ? window : globalThis);
