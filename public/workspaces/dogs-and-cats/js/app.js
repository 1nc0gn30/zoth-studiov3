/**
 * KINDRED & PAW — Master Application & Interactive Logic Engine
 * World-Class Canine & Feline Sanctuary Platform
 */

(function () {
  'use strict';

  // State Management
  const AppState = {
    currentRoute: 'home',
    theme: localStorage.getItem('kindred_theme') || 'dark',
    audioActive: false,
    audioContext: null,
    audioNodes: {},
    quizAnswers: {},
    quizStep: 0
  };

  // Toxic Foods & Hazards Database
  const TOXIC_VAULT = [
    {
      name: "Chocolate & Theobromine",
      species: "Dogs & Cats",
      level: "severe",
      reaction: "Stimulates nervous system and cardiac muscle; causes vomiting, tachycardia, tremors, and seizures.",
      action: "Emergency vet triage immediately. Induce vomiting only under veterinary direction."
    },
    {
      name: "Grapes, Raisins & Currants",
      species: "Dogs (Highly Sensitive)",
      level: "severe",
      reaction: "Tartaric acid causes acute renal (kidney) failure even in microscopic quantities.",
      action: "Immediate fluid diuresis protocol at emergency hospital within 2 hours."
    },
    {
      name: "Lilies (All True Species)",
      species: "Cats (EXTREMELY LETHAL)",
      level: "severe",
      reaction: "A single lick of pollen or sip of vase water causes fatal acute kidney necrosis within 36-72 hours.",
      action: "Fatal emergency. Rush cat to ER immediately; aggressive IV fluids required."
    },
    {
      name: "Xylitol (Birch Sugar / E967)",
      species: "Dogs",
      level: "severe",
      reaction: "Triggers catastrophic insulin surge causing lethal hypoglycemia and liver failure in minutes.",
      action: "Immediate dextrose administration by veterinary team. Check peanut butter labels!"
    },
    {
      name: "Onions, Garlic, Leeks & Chives",
      species: "Cats & Dogs (Cats 5x more sensitive)",
      level: "severe",
      reaction: "N-propyl disulfide oxidizes hemoglobin, destroying red blood cells (Heinz body hemolytic anemia).",
      action: "Veterinary decontamination and oxygen support if respiratory distress occurs."
    },
    {
      name: "Macadamia Nuts",
      species: "Dogs",
      level: "moderate",
      reaction: "Causes hind-limb paralysis, hyperthermia, tremors, and severe lethargy lasting 12-48 hours.",
      action: "Supportive veterinary monitoring and pain management."
    },
    {
      name: "Raw Yeast Dough",
      species: "Dogs & Cats",
      level: "severe",
      reaction: "Dough expands in stomach causing gastric dilatation-volvulus (GDV); yeast fermentation causes alcohol poisoning.",
      action: "Urgent surgical decompression or stomach lavage may be needed."
    },
    {
      name: "Acetaminophen (Tylenol/Paracetamol)",
      species: "Cats (Fatal) & Dogs",
      level: "severe",
      reaction: "Cats lack glucuronyl transferase enzyme; results in toxic methemoglobinemia and asphyxiation.",
      action: "Fatal emergency for cats. Administer N-acetylcysteine antidote immediately."
    },
    {
      name: "Avocado (Persin Toxin)",
      species: "Birds & Rodents (High) / Dogs & Cats (Moderate Pit Choking)",
      level: "moderate",
      reaction: "High fat content can trigger acute pancreatitis; seeds present severe bowel obstruction risk.",
      action: "Monitor for vomiting; if pit was swallowed, seek immediate ultrasound/radiograph."
    },
    {
      name: "Cooked Animal Bones",
      species: "Dogs & Cats",
      level: "moderate",
      reaction: "Cooking makes bones brittle, causing sharp splinters that puncture esophageal or intestinal walls.",
      action: "Feed only raw meaty bones suited to size under strict observation; never cooked."
    },
    {
      name: "Citrus Essential Oils (Tea Tree, Pine, Eucalyptus)",
      species: "Cats (Liver Toxicity)",
      level: "severe",
      reaction: "Inhalation or skin absorption leads to neurological depression, tremors, and liver toxicity.",
      action: "Do not use ultrasonic diffusers with high-concentration essential oils around felines."
    },
    {
      name: "Pomegranate, Blueberries & Pumpkin",
      species: "Dogs & Cats",
      level: "safe",
      reaction: "Rich in antioxidants, beta-carotene, and natural fiber supporting healthy gut microbiome.",
      action: "Safe in moderation as wholesome toppers or training rewards!"
    }
  ];

  // Matchmaker Quiz Questions
  const QUIZ_DATA = [
    {
      question: "How would you describe your typical weekday schedule and time away from home?",
      options: [
        { title: "Home all day or hybrid with flexible walking breaks", sub: "Available every 2-4 hours for interaction and outdoor outings", dog: 3, cat: 2 },
        { title: "Away for 6-9 hours daily with steady evening presence", sub: "Prefer a pet who is content resting independently while I'm at work", dog: 1, cat: 4 },
        { title: "Frequent travel, unpredictable hours, and spontaneous trips", sub: "Need low day-to-day dependency and easy boarding/care", dog: 0, cat: 3 },
        { title: "High-energy lifestyle seeking a dedicated outdoor partner", sub: "Want a companion to accompany me on hikes, jogs, and cafes", dog: 5, cat: 0 }
      ]
    },
    {
      question: "What is your living environment and access to outdoor space?",
      options: [
        { title: "Apartment or condo without a private yard", sub: "Vertical space, quiet hours, and indoor enrichment matter most", dog: 1, cat: 4 },
        { title: "Suburban home with a fenced yard and neighborhood trails", sub: "Easy outdoor bathroom access and space to romp", dog: 4, cat: 3 },
        { title: "Rural property or acreage with wide-open freedom", sub: "Ideal for boundless energy, guard instincts, and exploration", dog: 5, cat: 2 },
        { title: "Cozy urban studio where quietness is paramount", sub: "Minimal noise tolerance from neighbors and compact layout", dog: 1, cat: 5 }
      ]
    },
    {
      question: "What kind of emotional connection and dynamic do you crave?",
      options: [
        { title: "Unconditional, enthusiastic greeting and eager-to-please loyalty", sub: "I love intense affection, belly rubs, and constant companionship", dog: 5, cat: 1 },
        { title: "Subtle, earned trust with quiet companionship beside me", sub: "I respect boundaries, slow-burn affection, and calm presence", dog: 1, cat: 5 },
        { title: "Playful comedy mixed with low-maintenance cuddles", sub: "Entertaining acrobatics and evening lap naps", dog: 2, cat: 4 },
        { title: "Structured working relationship and training discipline", sub: "Eager to teach complex tricks, obedience, and agility tasks", dog: 5, cat: 0 }
      ]
    },
    {
      question: "How do you feel about daily hygiene, grooming, and maintenance?",
      options: [
        { title: "Happy to walk in the rain, pick up poop on walks, and bathe regularly", sub: "Outdoor bathroom trips don't phase me regardless of weather", dog: 5, cat: 1 },
        { title: "Prefer a discreet indoor litter box scooped once or twice daily", sub: "Self-grooming and zero rainy midnight walks", dog: 0, cat: 5 },
        { title: "Willing to brush daily and manage shedding with proper tools", sub: "Enjoy the ritual of coat maintenance and bonding", dog: 3, cat: 3 },
        { title: "Desire lowest possible physical maintenance and minimal noise", sub: "Simple feeding, clean water fountain, and serene silence", dog: 1, cat: 4 }
      ]
    },
    {
      question: "What is your comfort level with annual pet care budgeting?",
      options: [
        { title: "Moderate Budget ($800 – $1,600 / year)", sub: "Comfortable with quality food, annual vet checkups, and basic toys", dog: 2, cat: 4 },
        { title: "High Investment ($2,000 – $4,500+ / year)", sub: "Ready for premium raw/fresh nutrition, insurance, training, and daycare", dog: 5, cat: 2 },
        { title: "Flexible & Prepared for Any Medical Need", sub: "Have emergency savings and comprehensive pet insurance active", dog: 4, cat: 4 }
      ]
    }
  ];

  // Cost Calculator Rates
  const COST_MATRIX = {
    dog: {
      small: { setup: 1150, monthly: 110, annualVet: 450, food: 45, insurance: 38, groom: 35 },
      medium: { setup: 1450, monthly: 165, annualVet: 550, food: 75, insurance: 52, groom: 50 },
      large: { setup: 1850, monthly: 230, annualVet: 700, food: 120, insurance: 75, groom: 65 }
    },
    cat: {
      small: { setup: 750, monthly: 85, annualVet: 320, food: 38, insurance: 25, litter: 22 },
      medium: { setup: 900, monthly: 105, annualVet: 380, food: 48, insurance: 30, litter: 25 },
      large: { setup: 1100, monthly: 135, annualVet: 450, food: 65, insurance: 38, litter: 30 }
    }
  };

  // Site Search Index
  const SEARCH_INDEX = [
    { title: "Canine Codex: The Dog Companion Guide", tag: "Guide", route: "dogs", snippet: "Instincts, pack dynamics, daily exercise archetypes, and positive reinforcement." },
    { title: "Feline Codex: The Cat Companion Guide", tag: "Guide", route: "cats", snippet: "Territory mapping, sensory superpowers, whisker fatigue, and play hunting cycles." },
    { title: "Canine Pros & Cons (The Real Truth)", tag: "Analysis", route: "dogs-pros-cons", snippet: "Unfiltered breakdown of loyalty, outdoor motivation vs separation anxiety and vet costs." },
    { title: "Feline Pros & Cons (The Real Truth)", tag: "Analysis", route: "cats-pros-cons", snippet: "Quiet elegance, apartment efficiency vs litter maintenance and nocturnal zoomies." },
    { title: "Head-to-Head Comparison Matrix", tag: "Decision", route: "compare", snippet: "12 lifestyle vectors compared side-by-side with matchmaker quiz." },
    { title: "The Art of Loving & Bonding", tag: "Behavior", route: "love-and-bonding", snippet: "Neuroscience of human-animal connection, reading micro-expressions and body language." },
    { title: "Holistic Nutrition & Toxic Food Vault", tag: "Wellness", route: "care-and-nutrition", snippet: "Species-appropriate feeding, raw vs kibble, and interactive toxic food database." },
    { title: "Lifelong Health & First Aid Directory", tag: "Medical", route: "health-and-safety", snippet: "Vital signs cheat sheet, emergency triage flowchart, and CPR protocol." },
    { title: "The Adoption & Rescue 3-3-3 Rule", tag: "Rescue", route: "adoption-guide", snippet: "Decompression in 3 days, routine in 3 weeks, sacred bond in 3 months." },
    { title: "Lifetime Pet Cost Simulator", tag: "Finance", route: "cost-calculator", snippet: "Interactive budget planner calculating first-year setup and 10-year lifetime costs." },
    { title: "Fine Art Companion Gallery", tag: "Gallery", route: "gallery", snippet: "Bespoke editorial photography of purebred and rescue dogs and cats." },
    { title: "Animal Psychology Mythbusters", tag: "Behavior", route: "mythbusters", snippet: "Debunking 12 common misconceptions including alpha dominance and cat aloofness." }
  ];

  // Core Initializer
  function init() {
    applyTheme(AppState.theme);
    setupNavigation();
    setupSoundEngine();
    setupMatchmakerQuiz();
    setupToxicFoodChecker();
    setupCostCalculator();
    setupGalleryFilters();
    setupAccordion();
    setupSearchModal();
    setupCarePlanGenerator();
    
    // Initial Route
    const initialRoute = window.location.hash.replace('#', '') || 'home';
    navigateTo(initialRoute, false);

    // Hash listener
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      navigateTo(hash, false);
    });
  }

  // Theme Management
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    AppState.theme = theme;
    localStorage.setItem('kindred_theme', theme);
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
      themeBtn.setAttribute('title', theme === 'light' ? 'Switch to Dark Sanctuary' : 'Switch to Warm Alabaster');
    }
  }

  // Navigation System
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .route-trigger');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const route = link.getAttribute('data-route') || link.getAttribute('href')?.replace('#', '');
        if (route) {
          e.preventDefault();
          navigateTo(route);
        }
      });
    });

    const mobileToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        mobileToggle.innerHTML = navMenu.classList.contains('open') ? '✕' : '☰';
      });
    }

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        applyTheme(AppState.theme === 'dark' ? 'light' : 'dark');
      });
    }
  }

  function navigateTo(routeId, pushHash = true) {
    const views = document.querySelectorAll('.page-view');
    let targetView = document.getElementById(`view-${routeId}`);
    
    if (!targetView) {
      targetView = document.getElementById('view-home');
      routeId = 'home';
    }

    views.forEach(v => v.classList.remove('active-view'));
    targetView.classList.add('active-view');
    AppState.currentRoute = routeId;

    if (pushHash) {
      window.location.hash = `#${routeId}`;
    }

    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-route') || link.getAttribute('href')?.replace('#', '');
      if (target === routeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.getElementById('mobileNavToggle');
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (mobileToggle) mobileToggle.innerHTML = '☰';
    }

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Ambient Purr & Harmony Sound Engine (Web Audio API)
  function setupSoundEngine() {
    const soundBtn = document.getElementById('soundToggleBtn');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
      if (AppState.audioActive) {
        stopAmbientSound();
        soundBtn.classList.remove('active');
        soundBtn.innerHTML = '🔈';
        soundBtn.setAttribute('title', 'Enable Calming Pet Soundscape');
      } else {
        startAmbientSound();
        soundBtn.classList.add('active');
        soundBtn.innerHTML = '🔊';
        soundBtn.setAttribute('title', 'Mute Calming Pet Soundscape');
      }
    });
  }

  function startAmbientSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      AppState.audioContext = new AudioCtx();
      const ctx = AppState.audioContext;
      
      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);

      // Low frequency rhythmic purr oscillator (25-30 Hz modulated)
      const purrOsc = ctx.createOscillator();
      purrOsc.type = 'triangle';
      purrOsc.frequency.setValueAtTime(26, ctx.currentTime);

      const purrMod = ctx.createOscillator();
      purrMod.type = 'sine';
      purrMod.frequency.setValueAtTime(2.2, ctx.currentTime); // 2.2 Hz breathing pulse

      const purrModGain = ctx.createGain();
      purrModGain.gain.setValueAtTime(12, ctx.currentTime);
      purrMod.connect(purrModGain);
      purrModGain.connect(purrOsc.frequency);

      // Gentle Harmonic Warmth Filter
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(140, ctx.currentTime);

      purrOsc.connect(lowpass);
      lowpass.connect(masterGain);

      purrOsc.start();
      purrMod.start();

      AppState.audioNodes = { masterGain, purrOsc, purrMod };
      AppState.audioActive = true;
    } catch (e) {
      console.warn("Web Audio not supported or blocked by browser policy", e);
    }
  }

  function stopAmbientSound() {
    if (AppState.audioContext) {
      try {
        AppState.audioNodes.masterGain?.gain.exponentialRampToValueAtTime(0.001, AppState.audioContext.currentTime + 1);
        setTimeout(() => {
          AppState.audioContext?.close();
          AppState.audioActive = false;
        }, 1100);
      } catch (e) {
        AppState.audioActive = false;
      }
    }
  }

  // Lifestyle Matchmaker Quiz Engine
  function setupMatchmakerQuiz() {
    renderQuizStep();

    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');
    const restartBtn = document.getElementById('quizRestartBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (AppState.quizStep > 0) {
          AppState.quizStep--;
          renderQuizStep();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (AppState.quizAnswers[AppState.quizStep] !== undefined) {
          if (AppState.quizStep < QUIZ_DATA.length - 1) {
            AppState.quizStep++;
            renderQuizStep();
          } else {
            calculateQuizResults();
          }
        } else {
          alert('Please select an option to continue.');
        }
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        AppState.quizStep = 0;
        AppState.quizAnswers = {};
        document.getElementById('quizResultView').classList.remove('active');
        document.getElementById('quizActiveView').style.display = 'block';
        renderQuizStep();
      });
    }
  }

  function renderQuizStep() {
    const currentQ = QUIZ_DATA[AppState.quizStep];
    const titleEl = document.getElementById('quizQuestionTitle');
    const stepLabel = document.getElementById('quizStepLabel');
    const fillEl = document.getElementById('quizProgressFill');
    const optionsGrid = document.getElementById('quizOptionsGrid');
    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');

    if (!titleEl || !currentQ) return;

    stepLabel.textContent = `Question ${AppState.quizStep + 1} of ${QUIZ_DATA.length}`;
    titleEl.textContent = currentQ.question;
    fillEl.style.width = `${((AppState.quizStep + 1) / QUIZ_DATA.length) * 100}%`;

    prevBtn.style.visibility = AppState.quizStep === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = AppState.quizStep === QUIZ_DATA.length - 1 ? 'Reveal My Match' : 'Next Question →';

    optionsGrid.innerHTML = '';
    currentQ.options.forEach((opt, idx) => {
      const btn = document.createElement('div');
      btn.className = `quiz-option-btn ${AppState.quizAnswers[AppState.quizStep] === idx ? 'selected' : ''}`;
      btn.innerHTML = `
        <div class="option-title">${opt.title}</div>
        <div class="option-sub">${opt.sub}</div>
      `;
      btn.addEventListener('click', () => {
        AppState.quizAnswers[AppState.quizStep] = idx;
        renderQuizStep();
      });
      optionsGrid.appendChild(btn);
    });
  }

  function calculateQuizResults() {
    let dogScore = 0;
    let catScore = 0;

    QUIZ_DATA.forEach((q, idx) => {
      const chosenIdx = AppState.quizAnswers[idx];
      if (chosenIdx !== undefined) {
        dogScore += q.options[chosenIdx].dog;
        catScore += q.options[chosenIdx].cat;
      }
    });

    const total = dogScore + catScore || 1;
    const dogPct = Math.round((dogScore / total) * 100);
    const catPct = 100 - dogPct;

    document.getElementById('quizActiveView').style.display = 'none';
    const resultView = document.getElementById('quizResultView');
    resultView.classList.add('active');

    document.getElementById('dogMatchScore').textContent = `${dogPct}%`;
    document.getElementById('catMatchScore').textContent = `${catPct}%`;

    const verdictTitle = document.getElementById('resultVerdictTitle');
    const verdictDesc = document.getElementById('resultVerdictDesc');

    if (dogPct >= 65) {
      verdictTitle.textContent = "Your Soul Companion: The Noble Canine (Dog)";
      verdictDesc.textContent = "Your active lifestyle, dedication to outdoor routines, and desire for deep, interactive loyalty align beautifully with a dog. Consider soulful breeds like the Golden Retriever, Australian Shepherd, or an affectionate rescue mixed-breed.";
    } else if (catPct >= 65) {
      verdictTitle.textContent = "Your Soul Companion: The Enigmatic Feline (Cat)";
      verdictDesc.textContent = "Your appreciation for calm sanctuary spaces, quiet independence, and subtle earned affection makes you an extraordinary feline guardian. Consider serene breeds like the British Shorthair, Ragdoll, or a sweet shelter adult cat.";
    } else {
      verdictTitle.textContent = "The Harmonious Dual Companion (Both Dog & Cat)";
      verdictDesc.textContent = "You possess a wonderfully balanced temperament! You have the energy for outdoor adventures alongside the appreciation for serene, cozy indoor solitude. A home with both a dog-friendly cat and a cat-friendly dog would flourish under your care.";
    }
  }

  // Toxic Food & Hazard Search Checker
  function setupToxicFoodChecker() {
    const input = document.getElementById('toxicSearchInput');
    const grid = document.getElementById('toxicCardsGrid');
    const filterBtns = document.querySelectorAll('.toxic-filter-pill');

    if (!input || !grid) return;

    let currentFilter = 'all';

    function renderCards(filterText = '') {
      const q = filterText.toLowerCase().trim();
      grid.innerHTML = '';

      const filtered = TOXIC_VAULT.filter(item => {
        const matchesQuery = item.name.toLowerCase().includes(q) || 
                             item.reaction.toLowerCase().includes(q) || 
                             item.species.toLowerCase().includes(q);
        const matchesLevel = currentFilter === 'all' || item.level === currentFilter;
        return matchesQuery && matchesLevel;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No hazardous substances found matching "${filterText}". Always consult your vet if in doubt!</div>`;
        return;
      }

      filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'toxic-item-card';
        card.innerHTML = `
          <span class="toxic-danger-badge danger-${item.level}">
            ${item.level === 'severe' ? '⚠️ High Danger / Emergency' : item.level === 'moderate' ? '⚡ Moderate Caution' : '✅ Safe & Wholesome'}
          </span>
          <div class="toxic-name">${item.name}</div>
          <div class="toxic-species-target">Target: <strong>${item.species}</strong></div>
          <div class="toxic-reaction">${item.reaction}</div>
          <div class="toxic-action-callout">Protocol: ${item.action}</div>
        `;
        grid.appendChild(card);
      });
    }

    input.addEventListener('input', (e) => renderCards(e.target.value));

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-level');
        renderCards(input.value);
      });
    });

    renderCards();
  }

  // Pet Cost Simulator
  function setupCostCalculator() {
    const speciesSelect = document.getElementById('calcSpecies');
    const sizeSelect = document.getElementById('calcSize');
    const tierSelect = document.getElementById('calcTier');

    if (!speciesSelect || !sizeSelect || !tierSelect) return;

    function recalculate() {
      const species = speciesSelect.value;
      const size = sizeSelect.value;
      const tierMult = tierSelect.value === 'luxury' ? 1.45 : tierSelect.value === 'premium' ? 1.2 : 1.0;

      const data = COST_MATRIX[species][size];
      const upfront = Math.round(data.setup * tierMult);
      const monthly = Math.round(data.monthly * tierMult);
      const annual = Math.round((monthly * 12) + (data.annualVet * tierMult));
      const lifetime10 = Math.round(upfront + (annual * 10));

      document.getElementById('calcUpfront').textContent = `$${upfront.toLocaleString()}`;
      document.getElementById('calcMonthly').textContent = `$${monthly.toLocaleString()}/mo`;
      document.getElementById('calcLifetime').textContent = `$${lifetime10.toLocaleString()}`;

      // Update itemized list
      const list = document.getElementById('calcBreakdownList');
      if (list) {
        list.innerHTML = `
          <div class="budget-item-row"><span>High-Quality Nutrition</span><span class="price">$${Math.round(data.food * tierMult)}/mo</span></div>
          <div class="budget-item-row"><span>Pet Health Insurance</span><span class="price">$${Math.round(data.insurance * tierMult)}/mo</span></div>
          <div class="budget-item-row"><span>Routine Annual Preventatives & Vaccines</span><span class="price">$${Math.round(data.annualVet * tierMult)}/yr</span></div>
          <div class="budget-item-row"><span>Hygiene, Grooming & Enrichment</span><span class="price">$${Math.round((data.groom || data.litter || 30) * tierMult)}/mo</span></div>
        `;
      }
    }

    speciesSelect.addEventListener('change', recalculate);
    sizeSelect.addEventListener('change', recalculate);
    tierSelect.addEventListener('change', recalculate);

    recalculate();
  }

  // Gallery Filters
  function setupGalleryFilters() {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const items = document.querySelectorAll('.art-gallery-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        items.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Accordion Logic
  function setupAccordion() {
    const triggers = document.querySelectorAll('.accordion-trigger');
    triggers.forEach(trig => {
      trig.addEventListener('click', () => {
        const item = trig.parentElement;
        item.classList.toggle('open');
      });
    });
  }

  // Universal Search Modal
  function setupSearchModal() {
    const modal = document.getElementById('searchModal');
    const openBtn = document.getElementById('openSearchModalBtn');
    const closeBtn = document.getElementById('closeSearchModalBtn');
    const input = document.getElementById('modalSearchInput');
    const resultsContainer = document.getElementById('modalSearchResults');

    if (!modal || !openBtn) return;

    function openModal() {
      modal.classList.add('active');
      input.value = '';
      renderSearchResults('');
      setTimeout(() => input.focus(), 50);
    }

    function closeModal() {
      modal.classList.remove('active');
    }

    openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Keyboard shortcut (Ctrl+K or Cmd+K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openModal();
      }
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    function renderSearchResults(query) {
      const q = query.toLowerCase().trim();
      resultsContainer.innerHTML = '';

      const matched = SEARCH_INDEX.filter(item => 
        !q || item.title.toLowerCase().includes(q) || item.snippet.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q)
      );

      if (matched.length === 0) {
        resultsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No matching guides or topics found for "${query}".</div>`;
        return;
      }

      matched.forEach(item => {
        const row = document.createElement('a');
        row.className = 'search-result-item';
        row.innerHTML = `
          <div class="result-tag">${item.tag}</div>
          <div class="result-title">${item.title}</div>
          <div class="result-snippet">${item.snippet}</div>
        `;
        row.addEventListener('click', (e) => {
          e.preventDefault();
          closeModal();
          navigateTo(item.route);
        });
        resultsContainer.appendChild(row);
      });
    }

    if (input) {
      input.addEventListener('input', (e) => renderSearchResults(e.target.value));
    }
  }

  // Custom Pet Care Plan Generator Modal
  function setupCarePlanGenerator() {
    const modal = document.getElementById('carePlanModal');
    const openBtns = document.querySelectorAll('.open-care-plan-btn');
    const closeBtn = document.getElementById('closeCarePlanModalBtn');
    const form = document.getElementById('carePlanForm');
    const resultBox = document.getElementById('carePlanGeneratedResult');

    if (!modal) return;

    openBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.add('active');
        if (resultBox) resultBox.style.display = 'none';
        if (form) form.style.display = 'block';
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const petName = document.getElementById('planPetName').value || 'Companion';
        const species = document.getElementById('planSpecies').value;
        const age = document.getElementById('planAge').value;
        const goal = document.getElementById('planGoal').value;

        form.style.display = 'none';
        resultBox.style.display = 'block';

        document.getElementById('planPrintTitle').textContent = `Master Care & Wellness Blueprint for ${petName}`;
        document.getElementById('planPrintContent').innerHTML = `
          <div style="margin: 1.5rem 0; line-height: 1.8;">
            <p><strong>Companion Profile:</strong> ${petName} (${species}, ${age})</p>
            <p><strong>Primary Sanctuary Focus:</strong> ${goal}</p>
            <hr style="border: 0; border-top: 1px solid var(--border-medium); margin: 1.2rem 0;">
            <h4 style="font-family: var(--font-serif); margin-bottom: 0.5rem; color: var(--accent-gold);">Daily Rhythm:</h4>
            <ul style="padding-left: 1.5rem; margin-bottom: 1.2rem;">
              <li><strong>Morning:</strong> Fresh filtered water refresh, ${species === 'Dog' ? '25-min decompression sniff walk' : '10-min feather wand hunting cycle'}, portioned high-protein breakfast.</li>
              <li><strong>Mid-Day:</strong> Mental enrichment puzzle, calm resting sanctuary, brief check-in.</li>
              <li><strong>Evening:</strong> ${species === 'Dog' ? 'Social walk or interactive fetch' : 'Second vertical play session & grooming brush'}, balanced dinner with natural omega-3 topper.</li>
              <li><strong>Night:</strong> 5-minute petting consent massage and cozy wind-down routine.</li>
            </ul>
            <h4 style="font-family: var(--font-serif); margin-bottom: 0.5rem; color: var(--accent-gold);">Monthly Preventive Checklist:</h4>
            <ul style="padding-left: 1.5rem;">
              <li>Flea/Tick/Heartworm preventative administration.</li>
              <li>Ear canal and dental plaque inspection.</li>
              <li>Weight & body condition score logging.</li>
            </ul>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print / Save PDF Blueprint</button>
        `;
      });
    }
  }

  // DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
