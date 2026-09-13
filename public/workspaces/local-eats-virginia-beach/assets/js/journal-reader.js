/**
 * Culinary Journal Reader & Article Modal
 * Ultra-readable editorial typography with instant access
 */

(function () {
  const articles = {
    'slow-hearth-roasting': {
      title: 'The Art of Slow Hearth Roasting: Why We Burn 3-Year Seasoned Virginia White Oak',
      category: 'Culinary Philosophy',
      readTime: '6 min read',
      date: 'September 2026',
      author: 'Marcus Vance, Executive Chef',
      authorRole: 'Founding Chef & Forager',
      authorAvatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
      heroImg: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
      content: `
        <p class="text-xl text-zinc-200 leading-relaxed font-serif italic mb-6">"Fire is not simply a heat source in our kitchen; it is an active, living ingredient that imparts sweetness, mineral depth, and ancient memory into every protein and vegetable we touch."</p>
        
        <p class="text-zinc-300 leading-relaxed mb-4">When we established Cinder & Tide on Pacific Avenue, we made an uncompromising commitment: no gas burners under our proteins, no artificial liquid smokes, and no high-output electric broilers. Every piece of Atlantic rockfish, every Lynnhaven oyster, and every aged ribeye passes over hand-split native Virginia timber.</p>
        
        <h3 class="text-2xl font-serif text-amber-300 mt-8 mb-3 font-semibold">The Anatomy of White Oak & Black Walnut Embers</h3>
        <p class="text-zinc-300 leading-relaxed mb-4">We source our wood exclusively from sustainably managed stands in Surry County and the Blue Ridge foothills. Seasoned for a minimum of 36 months in open-air covered cribs, the moisture content drops to an exact 14–16%. This allows the wood to burn with intense, clean thermal energy rather than acrid creosote smoke.</p>
        
        <blockquote class="my-6 border-l-2 border-amber-500/60 pl-4 py-1 text-zinc-200 italic font-serif text-lg bg-white/[0.02]">
          "White oak gives a subtle, toasted caramel finish; sweet black walnut brings tannin and musk, ideal for dense game and cured meats."
        </blockquote>

        <h3 class="text-2xl font-serif text-amber-300 mt-8 mb-3 font-semibold">Zonal Heat Architecture</h3>
        <p class="text-zinc-300 leading-relaxed mb-4">Our custom 10-foot hearth is engineered with adjustable Basque-style cast iron wheels. We calibrate four distinct cooking zones:</p>
        <ul class="list-disc list-inside space-y-2 text-zinc-300 mb-6 pl-2">
          <li><strong class="text-white">Direct Roaring Coal Zone (750°F):</strong> For rapid searing of dry-aged beef and blistered Jimmy Nardello peppers.</li>
          <li><strong class="text-white">Radiant Slow-Ember Tier (380°F):</strong> Gentle heat for roasting whole flounder and wood-fired bone marrow.</li>
          <li><strong class="text-white">The Ash Bed (250°F):</strong> Burying root vegetables like celeriac and heirloom sweet potatoes directly in glowing embers until caramelized into velvety custard.</li>
          <li><strong class="text-white">Upper Smoking Racks (140°F):</strong> Cold-smoking sea salt, cultured butter, and house garum.</li>
        </ul>

        <p class="text-zinc-300 leading-relaxed">Next time you take a seat at the Live Walnut Hearth Counter, watch the coals breathe. It’s an ancient rhythm that anchors everything we do along the Virginia coast.</p>
      `
    },
    'oyster-harvesters': {
      title: 'Chincoteague to Cape Henry: A Season with Virginia Oyster Harvesters',
      category: 'Sourcing & Terroir',
      readTime: '5 min read',
      date: 'August 2026',
      author: 'Elena Rostova, Beverage Director & Sourcing Lead',
      authorRole: 'Sommelier & Co-Founder',
      authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      heroImg: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85',
      content: `
        <p class="text-xl text-zinc-200 leading-relaxed font-serif italic mb-6">"Tasting an oyster from Lynnhaven Bay next to one from Seaside Chincoteague is the oceanic equivalent of comparing a mineral Chablis with a lush Sancerre."</p>
        
        <p class="text-zinc-300 leading-relaxed mb-4">Virginia’s Chesapeake Bay and Atlantic coastline represent one of the most ecologically diverse bivalve ecosystems in the world. With seven distinct salinity regions, the local waters allow us to curate an oyster flight that tells a geographic story with every shell opened.</p>
        
        <h3 class="text-2xl font-serif text-amber-300 mt-8 mb-3 font-semibold">The Salinity Spectrum</h3>
        <p class="text-zinc-300 leading-relaxed mb-4">In our daily raw bar program, we balance extreme briny high-salinity Seaside specimens with the sweet, buttery low-salinity oysters nurtured in upper estuarine waters:</p>
        <ul class="list-disc list-inside space-y-2 text-zinc-300 mb-6 pl-2">
          <li><strong class="text-white">Seaside Salts (31 ppt Salinity):</strong> Crisp, aggressive ocean brine with a clean, flinty cucumber finish. Shucked raw over shaved sea-kelp ice.</li>
          <li><strong class="text-white">Lynnhaven Fancies (21 ppt Salinity):</strong> Plump and sweet with notes of toasted almond, finished with a quick flash of woodfire bacon-shallot butter.</li>
          <li><strong class="text-white">Rappahannock Rivers (14 ppt Salinity):</strong> Delicate, buttery, low mineral astringency—the perfect pairing for sparkling Chenin Blanc.</li>
        </ul>

        <p class="text-zinc-300 leading-relaxed">We work directly with third-generation family leaseholders who harvest within 18 hours of reaching our oyster bar on Pacific Avenue.</p>
      `
    },
    'autumn-fermentation': {
      title: 'Autumn Fermentation: Smoked Chili, Sea Buckthorn & Wild Honey Vinegar',
      category: 'Pantry Lab',
      readTime: '4 min read',
      date: 'July 2026',
      author: 'Marcus Vance, Executive Chef',
      authorRole: 'Founding Chef & Forager',
      authorAvatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
      heroImg: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
      content: `
        <p class="text-xl text-zinc-200 leading-relaxed font-serif italic mb-6">"Acidity is the foil to wood smoke. Without vibrant, living fermentation, rich wood-charred proteins would overwhelm the palate."</p>
        
        <p class="text-zinc-300 leading-relaxed mb-4">In our cellar pantry behind the prep kitchen, dozens of glass carboys bubble steadily under temperature-controlled darkness. This is our house vinegar and koji project, turning local windfall apples, forage-harvested beach plums, and Pungo wild blossom honey into concentrated seasoning liquids.</p>
        
        <h3 class="text-2xl font-serif text-amber-300 mt-8 mb-3 font-semibold">The 12-Month Smoked Pepper Garum</h3>
        <p class="text-zinc-300 leading-relaxed mb-4">Using leftover trims of wood-roasted rockfish and roasted habanada chilies combined with Aspergillus oryzae koji, we age our savory garum for 12 months. It produces a glutamate-rich elixir that elevates our wood-fired greens, glazes roasted duck, and deepens our coastal reduction sauces.</p>
      `
    },
    'natural-wine-woodfire': {
      title: 'Pairing Low-Intervention Wines with Wood-Charred Seafood',
      category: 'Cellar & Spirits',
      readTime: '5 min read',
      date: 'June 2026',
      author: 'Elena Rostova, Beverage Director & Sourcing Lead',
      authorRole: 'Sommelier & Co-Founder',
      authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      heroImg: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
      content: `
        <p class="text-xl text-zinc-200 leading-relaxed font-serif italic mb-6">"Heavy oak barrels and massive tannins clash with smoky crusts; what woodfire truly craves is volcanic acidity and saline tension."</p>
        
        <p class="text-zinc-300 leading-relaxed mb-4">Our 140-bottle cellar focuses on biodynamic producers working with granite, limestone, and volcanic soils. Discover why Jura Savagnin, Etna Bianco, and Loire Valley Cabernet Franc form the backbone of our nightly beverage pairings.</p>
      `
    }
  };

  const journalModal = document.getElementById('journal-modal');
  const journalModalTitle = document.getElementById('journal-modal-title');
  const journalModalMeta = document.getElementById('journal-modal-meta');
  const journalModalHero = document.getElementById('journal-modal-hero');
  const journalModalBody = document.getElementById('journal-modal-body');
  const journalModalAuthor = document.getElementById('journal-modal-author');
  const journalModalClose = document.getElementById('journal-modal-close');

  if (!journalModal) return;

  function openArticle(articleId) {
    const data = articles[articleId];
    if (!data) return;

    journalModalTitle.textContent = data.title;
    journalModalMeta.innerHTML = `
      <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">${data.category}</span>
      <span class="text-xs text-zinc-400">• ${data.date}</span>
      <span class="text-xs text-zinc-400">• ${data.readTime}</span>
    `;

    journalModalHero.src = data.heroImg;
    journalModalHero.alt = data.title;
    journalModalBody.innerHTML = data.content;

    journalModalAuthor.innerHTML = `
      <img src="${data.authorAvatar}" alt="${data.author}" class="w-12 h-12 rounded-full object-cover border border-amber-500/30">
      <div>
        <h4 class="text-sm font-semibold text-white">${data.author}</h4>
        <p class="text-xs text-zinc-400">${data.authorRole} at Cinder & Tide</p>
      </div>
    `;

    journalModal.classList.remove('hidden');
    journalModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    journalModalClose.focus();
  }

  function closeArticle() {
    journalModal.classList.add('hidden');
    journalModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  // Trigger bindings
  document.querySelectorAll('.open-article-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = btn.getAttribute('data-article-id');
      openArticle(articleId);
    });
  });

  if (journalModalClose) {
    journalModalClose.addEventListener('click', closeArticle);
  }

  journalModal.addEventListener('click', (e) => {
    if (e.target === journalModal) {
      closeArticle();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!journalModal.classList.contains('hidden') && e.key === 'Escape') {
      closeArticle();
    }
  });
})();
