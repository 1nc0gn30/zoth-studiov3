// Neal's Deals On Wheels - Main Application Engine

(function() {
  'use strict';

  // State
  const state = {
    scene3D: null,
    cart: [],
    selectedResidence: null,
    activeCategory: 'all',
    appliedPromo: null,
    selectedTip: 3.00,
    deliveryType: 'doorstep', // 'doorstep', 'concierge', 'lobby'
    deliveryNotes: '',
    soundMuted: false,
    activeOrder: null
  };

  // DOM Elements
  let elements = {};

  function initApp() {
    cacheElements();
    init3D();
    renderCatalog();
    renderResidenceSelects();
    setupEventHandlers();
    updateCartUI();
    lucide.createIcons();

    // Check saved mute state
    if (window.soundFX && window.soundFX.muted) {
      updateSoundButtonUI(true);
    }
  }

  function cacheElements() {
    elements = {
      canvas3d: document.getElementById('canvas-3d-container'),
      catalogGrid: document.getElementById('catalog-grid'),
      cartCountBadges: document.querySelectorAll('.cart-count-badge'),
      cartSubtotalDisplays: document.querySelectorAll('.cart-subtotal-display'),
      cartDrawer: document.getElementById('cart-drawer'),
      cartOverlay: document.getElementById('cart-overlay'),
      cartItemsList: document.getElementById('cart-items-list'),
      cartEmptyState: document.getElementById('cart-empty-state'),
      cartCheckoutBtn: document.getElementById('cart-checkout-btn'),
      buildingSelect: document.getElementById('residence-select'),
      radiusInput: document.getElementById('radius-address-input'),
      radiusResult: document.getElementById('radius-result-card'),
      modalBuildingInfo: document.getElementById('building-info-modal'),
      trackerModal: document.getElementById('order-tracker-modal'),
      soundToggleBtn: document.getElementById('sound-toggle-btn'),
      gameModal: document.getElementById('mini-game-modal')
    };
  }

  function init3D() {
    if (typeof TownCenter3DScene !== 'undefined') {
      state.scene3D = new TownCenter3DScene('canvas-3d-container');

      // Global Callbacks from 3D scene
      window.onLocationSelected = (locationData) => {
        showLocationDetailsModal(locationData);
      };

      window.onLocationHovered = (locationData) => {
        const tooltip = document.getElementById('scene-hover-tooltip');
        if (tooltip) {
          if (locationData) {
            tooltip.innerHTML = `
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full ${locationData.locType === 'residence' ? 'bg-sky-400' : 'bg-amber-400'}"></span>
                <span class="font-bold text-white text-xs">${locationData.name}</span>
              </div>
              <p class="text-[11px] text-slate-300 mt-0.5">${locationData.category || locationData.cuisine || 'Town Center Spot'}</p>
            `;
            tooltip.classList.remove('hidden');
          } else {
            tooltip.classList.add('hidden');
          }
        }
      };

      window.onRadiusChecked = (result) => {
        displayRadiusResult(result);
      };

      window.onGameScoreUpdate = (score, timeLeft) => {
        const scoreEl = document.getElementById('game-score-val');
        const timeEl = document.getElementById('game-time-val');
        if (scoreEl) scoreEl.textContent = score;
        if (timeEl) timeEl.textContent = timeLeft + 's';
      };

      window.onGameOver = (finalScore) => {
        alert(`🏁 Delivery Dash Complete! You scored ${finalScore} points! Neal gave you a .00 promo code: NEALWHEELS`);
      };
    }
  }

  // Render Venue Catalog
  function renderCatalog(filterCategory = 'all', searchQuery = '') {
    const grid = elements.catalogGrid;
    if (!grid) return;

    const data = window.TOWN_CENTER_DATA;
    if (!data) return;

    let venues = data.venues;

    if (filterCategory !== 'all') {
      venues = venues.filter(v => v.type === filterCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      venues = venues.filter(v => 
        v.name.toLowerCase().includes(q) ||
        v.cuisine.toLowerCase().includes(q) ||
        v.items.some(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
      );
    }

    if (venues.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
          <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 text-slate-500"></i>
          <p class="text-lg font-semibold text-white">No plaza spots matching "${searchQuery}"</p>
          <p class="text-sm text-slate-400 mt-1">Need something special? Use our Custom Errand dispatch below!</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    grid.innerHTML = venues.map(venue => {
      return `
        <div class="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between interactive-card">
          <div>
            <div class="flex items-start justify-between gap-3 mb-2">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  venue.badge.includes('Favorite') ? 'badge-emerald' : venue.badge.includes('Fast') ? 'badge-cyan' : 'badge-amber'
                }">
                  ${venue.badge}
                </span>
                <h3 class="text-lg font-bold text-white mt-1.5 font-display">${venue.name}</h3>
                <p class="text-xs text-slate-400">${venue.cuisine}</p>
              </div>
              <button onclick="window.appFocusVenue('${venue.id}')" title="Locate on 3D Map" class="p-2 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-all border border-slate-700/50">
                <i data-lucide="map-pin" class="w-4 h-4"></i>
              </button>
            </div>

            <div class="flex items-center gap-4 text-xs text-slate-300 my-3 py-2 px-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <div class="flex items-center gap-1 text-amber-400 font-semibold">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
                ${venue.rating}
              </div>
              <div class="flex items-center gap-1 text-slate-300">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-emerald-400"></i>
                Prep: ${venue.prepTimeMin}
              </div>
              <div class="text-slate-400 font-mono">${venue.priceLevel}</div>
            </div>

            <!-- Popular Items -->
            <div class="space-y-2 mt-4">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Popular Items</p>
              ${venue.items.map(item => `
                <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-semibold text-white truncate">${item.name}</p>
                      ${item.tag ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">${item.tag}</span>` : ''}
                    </div>
                    <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${item.desc}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-emerald-400 font-mono">$${item.price.toFixed(2)}</span>
                    <button onclick="window.appAddToCart('${venue.id}', '${item.id}')" class="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-sm hover:scale-105 active:scale-95">
                      <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span class="truncate max-w-[200px]"><i data-lucide="navigation" class="w-3 h-3 inline mr-1 text-slate-500"></i>${venue.address}</span>
            <button onclick="window.appFocusVenue('${venue.id}')" class="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline flex items-center gap-1">
              View in 3D <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons();
  }

  // Render Residence Dropdowns
  function renderResidenceSelects() {
    const data = window.TOWN_CENTER_DATA;
    if (!data) return;

    const select = elements.buildingSelect;
    if (select) {
      select.innerHTML = `
        <option value="">Select Your Town Center Residence / Tower...</option>
        ${data.residences.map(r => `
          <option value="${r.id}">${r.name} (${r.estDeliveryMin})</option>
        `).join('')}
      `;
    }

    // Render Quick Buttons in Radius Section
    const quickContainer = document.getElementById('quick-residence-pills');
    if (quickContainer) {
      quickContainer.innerHTML = data.residences.map(r => `
        <button onclick="window.appSelectResidence('${r.id}')" class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 text-xs font-semibold text-slate-200 hover:text-emerald-400 border border-slate-700/60 hover:border-emerald-500/40 transition-all flex items-center gap-1.5">
          <i data-lucide="building-2" class="w-3.5 h-3.5 text-sky-400"></i>
          ${r.name}
        </button>
      `).join('');
    }

    // Render Quick Jump Bar below 3D scene
    const jumpBar = document.getElementById('quick-3d-jump-bar');
    if (jumpBar) {
      const topSpots = [
        ...data.residences.slice(0, 3),
        ...data.venues.slice(0, 4)
      ];
      jumpBar.innerHTML = topSpots.map(spot => `
        <button onclick="window.appFocusVenue('${spot.id}')" class="px-3 py-1.5 rounded-xl bg-slate-900/90 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 transition-all flex items-center gap-1.5 whitespace-nowrap">
          <span class="w-2 h-2 rounded-full ${spot.id.startsWith('res') ? 'bg-sky-400' : 'bg-amber-400'}"></span>
          ${spot.name}
        </button>
      `).join('');
    }
  }

  // Event Handlers
  function setupEventHandlers() {
    // Category Tabs
    document.querySelectorAll('.catalog-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.catalog-tab-btn').forEach(b => b.classList.remove('nav-tab-active', 'bg-emerald-500/20', 'border-emerald-500'));
        btn.classList.add('nav-tab-active');
        state.activeCategory = btn.dataset.category || 'all';
        renderCatalog(state.activeCategory, document.getElementById('catalog-search-input')?.value || '');
        if (window.soundFX) window.soundFX.playClick();
      });
    });

    // Search Input
    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderCatalog(state.activeCategory, e.target.value);
      });
    }

    // Cart Drawer Toggles
    document.querySelectorAll('.open-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => openCartDrawer());
    });
    document.querySelectorAll('.close-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => closeCartDrawer());
    });
    if (elements.cartOverlay) {
      elements.cartOverlay.addEventListener('click', () => closeCartDrawer());
    }

    // Sound Mute Toggle
    if (elements.soundToggleBtn) {
      elements.soundToggleBtn.addEventListener('click', () => {
        if (window.soundFX) {
          const isMuted = window.soundFX.toggleMute();
          updateSoundButtonUI(isMuted);
        }
      });
    }

    // Bell Ring Button
    const bellBtn = document.getElementById('ring-bell-btn');
    if (bellBtn) {
      bellBtn.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playBikeBell();
      });
    }

    // 3D View Presets
    document.querySelectorAll('.camera-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.camera-preset-btn').forEach(b => b.classList.remove('bg-emerald-500', 'text-slate-950', 'font-bold'));
        btn.classList.add('bg-emerald-500', 'text-slate-950', 'font-bold');
        const mode = btn.dataset.camMode;
        if (state.scene3D) state.scene3D.setCameraMode(mode);
        if (window.soundFX) window.soundFX.playClick();
      });
    });

    // Theme Mode Toggles (Day, Sunset, Night)
    document.querySelectorAll('.theme-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-mode-btn').forEach(b => b.classList.remove('bg-slate-700', 'text-white'));
        btn.classList.add('bg-slate-700', 'text-white');
        const theme = btn.dataset.theme;
        if (state.scene3D) state.scene3D.setTheme(theme);
        if (window.soundFX) window.soundFX.playClick();
      });
    });

    // Weather Rain Toggle
    const rainBtn = document.getElementById('rain-toggle-btn');
    if (rainBtn) {
      rainBtn.addEventListener('click', () => {
        if (state.scene3D) {
          const raining = state.scene3D.toggleRain();
          rainBtn.classList.toggle('text-sky-400', raining);
          rainBtn.classList.toggle('bg-sky-500/20', raining);
        }
      });
    }

    // Mini-Game Trigger
    const miniGameBtn = document.getElementById('start-mini-game-btn');
    if (miniGameBtn) {
      miniGameBtn.addEventListener('click', () => {
        if (state.scene3D) {
          state.scene3D.startGameMode();
          document.getElementById('mini-game-hud')?.classList.remove('hidden');
          if (window.soundFX) window.soundFX.playRadioChirp();
        }
      });
    }

    const exitGameBtn = document.getElementById('exit-mini-game-btn');
    if (exitGameBtn) {
      exitGameBtn.addEventListener('click', () => {
        if (state.scene3D) {
          state.scene3D.endGameMode();
          document.getElementById('mini-game-hud')?.classList.add('hidden');
        }
      });
    }

    // Custom Errand Form
    const errandForm = document.getElementById('custom-errand-form');
    if (errandForm) {
      errandForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const venue = document.getElementById('errand-venue-input')?.value || 'Plaza Errand';
        const details = document.getElementById('errand-details-input')?.value || 'Custom Item Pickup';
        const estCost = parseFloat(document.getElementById('errand-cost-input')?.value || '15.00');

        addCustomErrandToCart(venue, details, estCost);
        errandForm.reset();
        openCartDrawer();
      });
    }

    // Tip Selectors
    document.querySelectorAll('.tip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('bg-emerald-500', 'text-slate-950'));
        btn.classList.add('bg-emerald-500', 'text-slate-950');
        state.selectedTip = parseFloat(btn.dataset.tip || '3.00');
        updateCartUI();
        if (window.soundFX) window.soundFX.playClick();
      });
    });

    // Promo Code Form
    const promoBtn = document.getElementById('apply-promo-btn');
    if (promoBtn) {
      promoBtn.addEventListener('click', () => {
        const codeInput = document.getElementById('promo-code-input');
        const code = codeInput?.value.trim().toUpperCase();
        applyPromoCode(code);
      });
    }

    // Address Verification Form
    const checkRadiusBtn = document.getElementById('check-radius-btn');
    if (checkRadiusBtn) {
      checkRadiusBtn.addEventListener('click', () => {
        const addr = elements.radiusInput?.value.trim();
        validateAddressRadius(addr);
      });
    }

    // Checkout / Dispatch Button
    if (elements.cartCheckoutBtn) {
      elements.cartCheckoutBtn.addEventListener('click', () => {
        dispatchLiveOrder();
      });
    }
  }

  function updateSoundButtonUI(isMuted) {
    const btn = elements.soundToggleBtn;
    if (btn) {
      btn.innerHTML = isMuted 
        ? '<i data-lucide="volume-x" class="w-4 h-4 text-rose-400"></i>' 
        : '<i data-lucide="volume-2" class="w-4 h-4 text-emerald-400"></i>';
      lucide.createIcons();
    }
  }

  // Cart Operations
  function addToCart(venueId, itemId) {
    const data = window.TOWN_CENTER_DATA;
    const venue = data.venues.find(v => v.id === venueId);
    if (!venue) return;

    const item = venue.items.find(i => i.id === itemId);
    if (!item) return;

    const existing = state.cart.find(c => c.venueId === venueId && c.itemId === itemId);
    if (existing) {
      existing.qty++;
    } else {
      state.cart.push({
        venueId,
        venueName: venue.name,
        itemId,
        name: item.name,
        price: item.price,
        qty: 1
      });
    }

    if (window.soundFX) window.soundFX.playClick();
    updateCartUI();
    showToast(`Added ${item.name} to Neal's Dispatch Run!`);
  }

  function addCustomErrandToCart(venue, details, estCost) {
    state.cart.push({
      venueId: 'custom-errand',
      venueName: venue,
      itemId: 'custom-' + Date.now(),
      name: `Special Request: ${details}`,
      price: estCost,
      qty: 1,
      isCustom: true
    });

    if (window.soundFX) window.soundFX.playRadioChirp();
    updateCartUI();
    showToast(`Custom errand added! Neal will verify in person.`);
  }

  function updateCartItemQty(index, delta) {
    if (!state.cart[index]) return;
    state.cart[index].qty += delta;
    if (state.cart[index].qty <= 0) {
      state.cart.splice(index, 1);
    }
    updateCartUI();
  }

  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = window.TOWN_CENTER_DATA?.pricingRules.flatDeliveryFee || 4.99;
    
    let promoDiscount = 0;
    if (state.appliedPromo) {
      promoDiscount = state.appliedPromo.discount;
    }

    const tip = state.selectedTip || 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee - promoDiscount + tip);

    // Update badging & counts
    elements.cartCountBadges.forEach(el => el.textContent = totalCount);
    elements.cartSubtotalDisplays.forEach(el => el.textContent = '$' + finalTotal.toFixed(2));

    // Update Drawer list
    if (elements.cartItemsList && elements.cartEmptyState) {
      if (state.cart.length === 0) {
        elements.cartEmptyState.classList.remove('hidden');
        elements.cartItemsList.classList.add('hidden');
        if (elements.cartCheckoutBtn) elements.cartCheckoutBtn.disabled = true;
      } else {
        elements.cartEmptyState.classList.add('hidden');
        elements.cartItemsList.classList.remove('hidden');
        if (elements.cartCheckoutBtn) elements.cartCheckoutBtn.disabled = false;

        elements.cartItemsList.innerHTML = state.cart.map((item, idx) => `
          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-xs text-emerald-400 font-semibold truncate">${item.venueName}</p>
              <p class="text-sm font-bold text-white truncate">${item.name}</p>
              <p class="text-xs text-slate-400 font-mono mt-0.5">$${item.price.toFixed(2)} each</p>
            </div>
            <div class="flex items-center gap-2.5">
              <button onclick="window.appUpdateCartQty(${idx}, -1)" class="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center transition-all">
                -
              </button>
              <span class="text-sm font-bold text-white font-mono w-4 text-center">${item.qty}</span>
              <button onclick="window.appUpdateCartQty(${idx}, 1)" class="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center transition-all">
                +
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // Update Price Summary fields
    const subtotalEl = document.getElementById('cart-summary-subtotal');
    const feeEl = document.getElementById('cart-summary-fee');
    const discountEl = document.getElementById('cart-summary-discount');
    const tipEl = document.getElementById('cart-summary-tip');
    const totalEl = document.getElementById('cart-summary-total');

    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (feeEl) feeEl.textContent = '$' + deliveryFee.toFixed(2);
    if (discountEl) discountEl.textContent = promoDiscount > 0 ? '-$' + promoDiscount.toFixed(2) : '$0.00';
    if (tipEl) tipEl.textContent = '$' + tip.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + finalTotal.toFixed(2);

    lucide.createIcons();
  }

  function applyPromoCode(code) {
    const rules = window.TOWN_CENTER_DATA?.pricingRules.promoCodes;
    const msgEl = document.getElementById('promo-status-msg');

    if (rules && rules[code]) {
      state.appliedPromo = rules[code];
      if (msgEl) {
        msgEl.className = 'text-xs text-emerald-400 mt-1 font-semibold';
        msgEl.textContent = `✅ Applied: ${rules[code].label} (-$${rules[code].discount.toFixed(2)})`;
      }
      if (window.soundFX) window.soundFX.playSuccess();
    } else {
      state.appliedPromo = null;
      if (msgEl) {
        msgEl.className = 'text-xs text-rose-400 mt-1 font-semibold';
        msgEl.textContent = '❌ Invalid code. Try TOWNCENTER or VIPRESIDENT';
      }
      if (window.soundFX) window.soundFX.playClick();
    }
    updateCartUI();
  }

  function openCartDrawer() {
    if (elements.cartDrawer && elements.cartOverlay) {
      elements.cartDrawer.classList.remove('translate-x-full');
      elements.cartOverlay.classList.remove('hidden');
      if (window.soundFX) window.soundFX.playClick();
    }
  }

  function closeCartDrawer() {
    if (elements.cartDrawer && elements.cartOverlay) {
      elements.cartDrawer.classList.add('translate-x-full');
      elements.cartOverlay.classList.add('hidden');
    }
  }

  // Address & 1-Mile Radius Checker
  function validateAddressRadius(addressText) {
    if (!addressText) return;
    const lower = addressText.toLowerCase();

    // Check against Town Center landmarks
    const residences = window.TOWN_CENTER_DATA?.residences || [];
    const matchedResidence = residences.find(r => 
      lower.includes(r.name.toLowerCase()) || 
      lower.includes(r.address.toLowerCase()) ||
      lower.includes(r.id.replace('res-', ''))
    );

    let distance = 0.35;
    let isInside = true;
    let name = addressText;

    if (matchedResidence) {
      distance = matchedResidence.distanceMiles;
      name = matchedResidence.name;
      if (state.scene3D) state.scene3D.focusBuilding(matchedResidence.id);
    } else if (lower.includes('virginia beach') && (lower.includes('town center') || lower.includes('commerce') || lower.includes('columbus') || lower.includes('central park') || lower.includes('market st') || lower.includes('pembroke'))) {
      distance = 0.42;
      isInside = true;
    } else if (lower.includes('oceanfront') || lower.includes('norfolk') || lower.includes('chesapeake') || lower.includes('shore dr')) {
      distance = 8.5;
      isInside = false;
    }

    displayRadiusResult({
      distanceMiles: distance,
      isInside: isInside,
      addressName: name,
      estDeliveryMin: isInside ? `${Math.round(8 + distance * 12)}-${Math.round(12 + distance * 12)} min` : 'Out of 1-Mile Zone'
    });
  }

  function displayRadiusResult(result) {
    const card = elements.radiusResult;
    if (!card) return;

    card.classList.remove('hidden');
    if (result.isInside) {
      card.innerHTML = `
        <div class="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3.5">
          <div class="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <i data-lucide="check-circle-2" class="w-6 h-6"></i>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Verified Town Center Zone</span>
              <span class="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-700">${result.distanceMiles} Miles from Plaza</span>
            </div>
            <p class="text-base font-bold text-white mt-1">${result.addressName || 'Target Location'}</p>
            <p class="text-xs text-slate-300 mt-1">
              ⚡ <strong>${result.estDeliveryMin}</strong> estimated delivery • Flat .99 courier rate • Doorstep & Concierge ready.
            </p>
            <button onclick="window.appScrollToCatalog()" class="mt-3 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5">
              Order From Plaza Spots Now <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
      if (window.soundFX) window.soundFX.playSuccess();
    } else {
      card.innerHTML = `
        <div class="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3.5">
          <div class="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
            <i data-lucide="alert-triangle" class="w-6 h-6"></i>
          </div>
          <div class="flex-1">
            <span class="text-xs font-bold uppercase tracking-wider text-rose-400">Outside 1-Mile Plaza Radius</span>
            <p class="text-base font-bold text-white mt-1">Location is ${result.distanceMiles} miles away</p>
            <p class="text-xs text-slate-300 mt-1">
              Neal's Deals On Wheels maintains an uncompromising 1-mile strict perimeter around Town Center so orders are never delayed in highway traffic.
            </p>
            <p class="text-xs text-amber-400 font-semibold mt-2">
              💡 Staying at Westin or Cosmopolitan? Select your tower directly!
            </p>
          </div>
        </div>
      `;
      if (window.soundFX) window.soundFX.playClick();
    }
    lucide.createIcons();
  }

  // Location Modal
  function showLocationDetailsModal(loc) {
    const modal = elements.modalBuildingInfo;
    const body = document.getElementById('building-info-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${loc.locType === 'residence' ? 'badge-cyan' : 'badge-amber'}">
            ${loc.category || loc.cuisine || 'Town Center Landmark'}
          </span>
          <h2 class="text-2xl font-bold text-white mt-1.5 font-display">${loc.name}</h2>
          <p class="text-xs text-slate-400 mt-0.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 inline mr-1 text-slate-500"></i>${loc.address}</p>
        </div>
        <button onclick="window.appCloseLocationModal()" class="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <p class="text-sm text-slate-300 my-4 leading-relaxed">${loc.desc}</p>

      ${loc.locType === 'residence' ? `
        <div class="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs mb-4">
          <div>
            <span class="text-slate-500 block">Delivery ETA:</span>
            <span class="font-bold text-emerald-400 text-sm">${loc.estDeliveryMin}</span>
          </div>
          <div>
            <span class="text-slate-500 block">Concierge / Drop:</span>
            <span class="font-semibold text-slate-200">${loc.concierge}</span>
          </div>
          <div class="col-span-2 pt-2 border-t border-slate-800/80">
            <span class="text-slate-500 block">Access Status:</span>
            <span class="font-semibold text-sky-400">Verified Neal Micro-Mobility Drop Zone</span>
          </div>
        </div>
        <button onclick="window.appSelectBuildingForOrder('${loc.id}')" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2">
          <i data-lucide="truck" class="w-4 h-4"></i>
          Set as My Delivery Address
        </button>
      ` : loc.locType === 'venue' ? `
        <div class="space-y-2 mb-4">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Menu Highlights</p>
          ${loc.items.map(item => `
            <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-white">${item.name}</p>
                <p class="text-xs font-mono text-emerald-400">$${item.price.toFixed(2)}</p>
              </div>
              <button onclick="window.appAddToCart('${loc.id}', '${item.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all">
                + Add
              </button>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;

    modal.classList.remove('hidden');
    lucide.createIcons();
  }

  // Simulated Live Order Dispatcher
  function dispatchLiveOrder() {
    if (state.cart.length === 0) return;

    closeCartDrawer();
    const tracker = elements.trackerModal;
    if (!tracker) return;

    tracker.classList.remove('hidden');
    if (window.soundFX) window.soundFX.playRadioChirp();

    // Switch 3D camera to follow courier!
    if (state.scene3D) {
      state.scene3D.setCameraMode('courier');
    }

    const orderId = 'NDOW-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('tracker-order-id').textContent = orderId;

    // Simulate 4 Live Dispatch Stages
    let step = 1;
    const statusText = document.getElementById('tracker-status-text');
    const progressBar = document.getElementById('tracker-progress-bar');
    const stepIndicators = [
      document.getElementById('step-1-dot'),
      document.getElementById('step-2-dot'),
      document.getElementById('step-3-dot'),
      document.getElementById('step-4-dot')
    ];

    function updateStep(s) {
      step = s;
      if (progressBar) progressBar.style.width = (s * 25) + '%';
      stepIndicators.forEach((dot, idx) => {
        if (dot) {
          if (idx + 1 <= s) {
            dot.className = 'w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg';
          } else {
            dot.className = 'w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700';
          }
        }
      });

      if (s === 1 && statusText) {
        statusText.textContent = "Order received by Neal. Bike battery 100%, dispatching to plaza!";
      } else if (s === 2 && statusText) {
        statusText.textContent = "Neal has arrived at restaurant! Order being boxed hot in thermal carrier.";
        if (window.soundFX) window.soundFX.playBikeBell();
      } else if (s === 3 && statusText) {
        statusText.textContent = "Rolling down Central Park Ave! 2 minutes out from your building.";
        if (window.soundFX) window.soundFX.playRadioChirp();
      } else if (s === 4 && statusText) {
        statusText.textContent = "🎉 ARRIVED! Package safely with concierge / doorstep. Enjoy your meal!";
        if (window.soundFX) window.soundFX.playSuccess();
      }
    }

    updateStep(1);
    setTimeout(() => updateStep(2), 3500);
    setTimeout(() => updateStep(3), 7500);
    setTimeout(() => updateStep(4), 11500);
  }

  // Global Helpers attached to window
  window.appAddToCart = (vId, iId) => addToCart(vId, iId);
  window.appUpdateCartQty = (idx, delta) => updateCartItemQty(idx, delta);
  window.appFocusVenue = (id) => {
    if (state.scene3D) state.scene3D.focusBuilding(id);
    const data = window.TOWN_CENTER_DATA;
    const all = [...data.residences, ...data.venues, ...data.landmarks];
    const loc = all.find(l => l.id === id);
    if (loc) showLocationDetailsModal(loc);
  };
  window.appSelectResidence = (resId) => {
    const r = window.TOWN_CENTER_DATA?.residences.find(item => item.id === resId);
    if (r) {
      if (elements.buildingSelect) elements.buildingSelect.value = resId;
      validateAddressRadius(r.name);
    }
  };
  window.appSelectBuildingForOrder = (resId) => {
    state.selectedResidence = resId;
    if (elements.buildingSelect) elements.buildingSelect.value = resId;
    window.appCloseLocationModal();
    openCartDrawer();
  };
  window.appCloseLocationModal = () => {
    elements.modalBuildingInfo?.classList.add('hidden');
  };
  window.appCloseTrackerModal = () => {
    elements.trackerModal?.classList.add('hidden');
    if (state.scene3D) state.scene3D.setCameraMode('orbit');
  };
  window.appScrollToCatalog = () => {
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  window.appScrollTo3D = () => {
    document.getElementById('interactive-3d-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-50 glass-panel-glow px-4 py-3 rounded-2xl text-white text-sm font-semibold flex items-center gap-2.5 shadow-2xl transition-all animate-bounce-slow';
    toast.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i> ${msg}`;
    document.body.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
