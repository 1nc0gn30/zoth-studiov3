// Node test harness for Zoth Bento Section & Component Library. Run: node zoth-site-sections.test.js
const Zss = require("./zoth-site-sections.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) {
    pass++;
    console.log("PASS  " + name);
  } else {
    fail++;
    console.log("FAIL  " + name);
  }
}

(function () {
  console.log("=== ZOTH SITE SECTIONS TEST SUITE ===");

  // 1. Exported Catalog & API Surface
  check("Zss has VERSION string", typeof Zss.VERSION === "string");
  check("Zss has HERO_VARIANTS", Boolean(Zss.HERO_VARIANTS.PARTICLE_MESH && Zss.HERO_VARIANTS.TILT_CARD_3D && Zss.HERO_VARIANTS.MINIMALIST_GLOW));
  check("Zss has BENTO_VARIANTS", Boolean(Zss.BENTO_VARIANTS.BENTO_4_BOX && Zss.BENTO_VARIANTS.BENTO_6_BOX));
  check("Zss has PRICING_VARIANTS", Boolean(Zss.PRICING_VARIANTS.MATRIX_TOGGLE));
  check("Zss has TESTIMONIAL_VARIANTS", Boolean(Zss.TESTIMONIAL_VARIANTS.INFINITE_MARQUEE && Zss.TESTIMONIAL_VARIANTS.INTERACTIVE_CARDS));
  check("Zss has SANDBOX_VARIANTS", Boolean(Zss.SANDBOX_VARIANTS.CODE_EXEC_AUDIO));
  check("Zss has FAQ_VARIANTS", Boolean(Zss.FAQ_VARIANTS.ACCORDION_A11Y));
  check("Zss has MODAL_VARIANTS", Boolean(Zss.MODAL_VARIANTS.WAITLIST_LEAD_CAPTURE));

  // 2. Hero Section Generators
  const heroParticle = Zss.generateHeroSection(Zss.HERO_VARIANTS.PARTICLE_MESH, { title: "Test Particle Title" });
  check("Hero Particle Mesh contains canvas and title", heroParticle.includes("zothParticleCanvas") && heroParticle.includes("Test Particle Title"));

  const heroTilt = Zss.generateHeroSection(Zss.HERO_VARIANTS.TILT_CARD_3D, { title: "3D Figurine Title" });
  check("Hero 3D Tilt contains tilt card and hologram", heroTilt.includes("zothTiltCard") && heroTilt.includes("zoth-holo-cube") && heroTilt.includes("3D Figurine Title"));

  const heroMin = Zss.generateHeroSection(Zss.HERO_VARIANTS.MINIMALIST_GLOW, { title: "Minimalist Title" });
  check("Hero Minimalist contains ambient glow and metrics", heroMin.includes("zoth-minimalist-ambient-glow") && heroMin.includes("zoth-metrics-strip") && heroMin.includes("Minimalist Title"));

  // 3. Bento Grid Generators
  const bento4 = Zss.generateBentoSection(Zss.BENTO_VARIANTS.BENTO_4_BOX, { title: "Custom Bento 4" });
  check("Bento 4-Box contains 4-grid and span-2 card", bento4.includes("zoth-bento-4") && bento4.includes("zoth-bento-span-2") && bento4.includes("Custom Bento 4"));

  const bento6 = Zss.generateBentoSection(Zss.BENTO_VARIANTS.BENTO_6_BOX, { title: "Custom Bento 6" });
  check("Bento 6-Box contains 6-grid and monitor", bento6.includes("zoth-bento-6") && bento6.includes("zoth-bento-swarm-monitor") && bento6.includes("Custom Bento 6"));

  // 4. Pricing Matrix Generator
  const pricing = Zss.generatePricingSection({ title: "Custom Pricing Matrix", discountBadge: "Save 25% Off" });
  check("Pricing contains monthly/annual buttons and data attributes", pricing.includes("zothMonthlyBtn") && pricing.includes("zothAnnualBtn") && pricing.includes('data-monthly="29"') && pricing.includes("Save 25% Off"));

  // 5. Testimonials Section Generators
  const marquee = Zss.generateTestimonialsSection(Zss.TESTIMONIAL_VARIANTS.INFINITE_MARQUEE, { title: "Wall of Love" });
  check("Testimonials Marquee contains marquee track", marquee.includes("zoth-marquee-track") && marquee.includes("Wall of Love"));

  const reviewCards = Zss.generateTestimonialsSection(Zss.TESTIMONIAL_VARIANTS.INTERACTIVE_CARDS, { title: "Client Reviews" });
  check("Testimonials Cards contains review grid", reviewCards.includes("zoth-reviews-grid") && reviewCards.includes("zoth-review-card"));

  // 6. Interactive Live Sandbox Generator
  const sandbox = Zss.generateSandboxSection({ title: "Live Node Console" });
  check("Sandbox contains Web Audio action buttons and console", sandbox.includes("zothRunSandbox('pulse')") && sandbox.includes("zothSimLog") && sandbox.includes("Live Node Console"));

  // 7. FAQ Accordion Generator
  const faq = Zss.generateFaqSection({ title: "Frequently Asked Questions" });
  check("FAQ contains accessible details and summary tags", faq.includes("<details class=\"zoth-faq-item\"") && faq.includes("zoth-faq-summary") && faq.includes("Frequently Asked Questions"));

  // 8. Lead Capture Waitlist Modal Generator
  const waitlist = Zss.generateWaitlistModal({ title: "Join Beta" });
  check("Waitlist Modal contains dialog, form, and validation inputs", waitlist.includes("<dialog id=\"zothWaitlistModal\"") && waitlist.includes("zothLeadEmail") && waitlist.includes("Join Beta"));

  // 9. Full Composite Page Generator
  const fullPage = Zss.generateFullPage({ siteName: "Zoth Test Foundry", heroVariant: Zss.HERO_VARIANTS.TILT_CARD_3D });
  check("Full Page contains complete HTML doctype and all sections", fullPage.includes("<!doctype html>") && fullPage.includes("<main>") && fullPage.includes("zothTiltCard") && fullPage.includes("zoth-site-footer") && fullPage.includes("zothPlayTone"));

  // 10. Mutation Helper (mutateSiteSection)
  const initialHtml = Zss.generateFullPage({ siteName: "Mutation Test", heroVariant: Zss.HERO_VARIANTS.TILT_CARD_3D });

  const mutatedToParticle = Zss.mutateSiteSection(initialHtml, "switch hero to particle canvas");
  check("Mutation switch hero to particle canvas", mutatedToParticle.includes("<canvas id=\"zothParticleCanvas\"") && !mutatedToParticle.includes("id=\"zothTiltCard\""));

  const mutatedToTilt = Zss.mutateSiteSection(mutatedToParticle, "switch hero to 3d tilt card figurine");
  check("Mutation switch hero to 3d tilt", mutatedToTilt.includes("id=\"zothTiltCard\"") && !mutatedToTilt.includes("<canvas id=\"zothParticleCanvas\""));

  const mutatedToMin = Zss.mutateSiteSection(mutatedToTilt, "switch hero to minimalist headline with glow badges");
  check("Mutation switch hero to minimalist", mutatedToMin.includes("zoth-hero-minimalist") && mutatedToMin.includes("zoth-metrics-strip") && !mutatedToMin.includes("id=\"zothTiltCard\""));

  const mutatedBento4 = Zss.mutateSiteSection(mutatedToMin, "switch to 4-box bento grid");
  check("Mutation switch to 4-box bento", mutatedBento4.includes("zoth-bento-4"));

  const mutatedPricingDiscount = Zss.mutateSiteSection(mutatedBento4, "add annual pricing discount and billing toggle");
  check("Mutation add annual pricing discount", mutatedPricingDiscount.includes("zoth-billing-toggle") && mutatedPricingDiscount.includes("zothProAnnualNote"));

  const mutatedTestimonialMarquee = Zss.mutateSiteSection(mutatedPricingDiscount, "add testimonial infinite marquee ticker");
  check("Mutation add testimonial marquee", mutatedTestimonialMarquee.includes("zoth-marquee-viewport"));

  const mutatedSandbox = Zss.mutateSiteSection(mutatedTestimonialMarquee, "add interactive live sandbox with audio feedback");
  check("Mutation add interactive sandbox", mutatedSandbox.includes("zoth-sandbox-card") && mutatedSandbox.includes("zothRunSandbox"));

  const mutatedFaq = Zss.mutateSiteSection(mutatedSandbox, "add accessible faq accordion");
  check("Mutation add accessible faq", mutatedFaq.includes("zoth-faq-container"));

  const mutatedWaitlist = Zss.mutateSiteSection(mutatedFaq, "add lead capture waitlist modal");
  check("Mutation add waitlist modal", mutatedWaitlist.includes("zothWaitlistModal"));

  // Mutation from empty string generates full page
  const emptyMutated = Zss.mutateSiteSection("", "create bento site with particle hero");
  check("Mutation on empty string returns full page", emptyMutated.includes("<!doctype html>") && emptyMutated.includes("<main>"));

  // 11. Tool Contract Validation & Runner
  const validateRes = Zss.validate({ action: "sections.list", params: {} });
  check("Validate contract valid action", validateRes.ok === true);

  const invalidRes = Zss.validate({ action: "unknown.action" });
  check("Validate contract invalid action", invalidRes.ok === false);

  const listRes = Zss.run({ action: "sections.list" });
  check("Run sections.list returns variants catalog", listRes.ok === true && listRes.data.hero_variants.length === 3);

  const genRes = Zss.run({ action: "sections.generate", params: { type: "hero", variant: "tilt-card-3d" } });
  check("Run sections.generate returns html", genRes.ok === true && genRes.data.html.includes("zothTiltCard"));

  const mutRes = Zss.run({ action: "sections.mutate", params: { currentHtml: initialHtml, instruction: "switch hero to minimalist" } });
  check("Run sections.mutate returns modified html", mutRes.ok === true && mutRes.data.html.includes("zoth-hero-minimalist"));

  const fullRes = Zss.run({ action: "sections.full_page", params: { siteName: "Runner Test" } });
  check("Run sections.full_page returns complete site", fullRes.ok === true && fullRes.data.html.includes("Runner Test"));

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
