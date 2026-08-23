/** Zoth Studio — Compliance Trust Badges (v2.0) */
(function(global){
  const ZothTrustBadges = { VERSION: '2.0.0', getBadges() { return ['SOC2 Type II', 'HIPAA Ready', 'GDPR Compliant', 'Zero Egress']; } };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothTrustBadges;
  else global.ZothTrustBadges = ZothTrustBadges;
})(typeof window !== 'undefined' ? window : globalThis);
