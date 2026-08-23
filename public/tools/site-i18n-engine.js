/**
 * Zoth Studio — Dynamic i18n Engine (v2.0)
 */
(function(global) {
  'use strict';
  const ZothI18n = {
    VERSION: '2.0.0',
    LANGS: ['en', 'es', 'ja', 'de', 'fr', 'zh'],
    translate(key, lang = 'en') {
      const dict = {
        en: { launch: 'Launch Workstation', docs: 'Documentation', pricing: 'Pricing' },
        es: { launch: 'Iniciar Estación', docs: 'Documentación', pricing: 'Precios' },
        ja: { launch: 'ワークステーション起動', docs: 'ドキュメント', pricing: '料金' },
        de: { launch: 'Workstation Starten', docs: 'Dokumentation', pricing: 'Preise' }
      };
      return (dict[lang] && dict[lang][key]) || key;
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothI18n;
  else global.ZothI18n = ZothI18n;
})(typeof window !== 'undefined' ? window : globalThis);
