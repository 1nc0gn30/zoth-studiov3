/** Zoth Studio — Social Share Bar (v2.0) */
(function(global){
  const ZothSocialShare = { VERSION: '2.0.0', share(platform) { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(document.title)}&url=${encodeURIComponent(location.href)}`, '_blank'); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothSocialShare;
  else global.ZothSocialShare = ZothSocialShare;
})(typeof window !== 'undefined' ? window : globalThis);
