// DELIVERED. - Main Application Logic & View Controller
// Hyper-Local Virginia Beach Town Center Micro-Mobility Delivery Network

import { TOWN_CENTER_GEO, RESIDENCES, MERCHANTS, ERRAND_TEMPLATES, COURIERS, PRICING_RULES } from './data.js';
import { sound } from './audio.js';
import { TownCenterMap } from './map.js';

class DeliveredApp {
  constructor() {
    this.state = {
      activeView: 'resident', // 'resident' | 'courier' | 'radar' | 'membership' | 'errand'
      activeCategory: 'All',
      searchQuery: '',
      cart: [],
      selectedMerchant: null,
      userResidence: RESIDENCES[0],
      userFloor: '8',
      userUnit: '814',
      userDeliveryNotes: 'Buzz code #4545. Take elevator to 8th floor, leave on doormat.',
      hasSubscriptionPass: true,
      subscriptionPlan: 'monthly',
      tipAmount: 5.00,
      customTipInput: '5.00',
      preferredWheels: 'all',
      activeOrder: null,
      orderProgressStep: 0,
      orderTimer: null,
      
      // Courier State
      courierOnline: true,
      selectedVehicle: 'onewheel',
      courierEarningsToday: 48.50,
      courierRunsToday: 5,
      courierActiveJob: null,
      incomingQueue: [
        {
          id: 'job-101',
          merchantName: 'Yard House',
          residenceName: 'The Cosmopolitan (Unit 912)',
          itemsSummary: 'Poke Nachos + Truffle Fries',
          distance: '0.2 mi',
          estimatedRoll: '3 min',
          baseFee: 2.50,
          tip: 6.50,
          payout: 9.00,
          urgency: 'Hot & Ready'
        },
        {
          id: 'job-102',
          merchantName: 'Town Center Cold Pressed',
          residenceName: 'The Westin Residences (Fl 24)',
          itemsSummary: '2x VB Sunrise Juices + Acai Bowl',
          distance: '0.3 mi',
          estimatedRoll: '4 min',
          baseFee: 2.50,
          tip: 5.00,
          payout: 7.50,
          urgency: 'Grab & Go'
        },
        {
          id: 'job-103',
          merchantName: 'Town Center Bodega & Mart',
          residenceName: 'Studio 78 / Encore (Unit 304)',
          itemsSummary: 'Celsius Energy + Ben & Jerry Pint',
          distance: '0.15 mi',
          estimatedRoll: '2 min',
          baseFee: 2.50,
          tip: 7.00,
          payout: 9.50,
          urgency: 'Late Night'
        }
      ]
    };

    this.mapEngine = null;
  }

  init() {
    this.renderHeader();
    this.renderActiveView();
    this.bindGlobalEvents();
    this.initMap();
    this.updateCartCount();
    
    // Refresh lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  initMap() {
    setTimeout(() => {
      const mapContainer = document.getElementById('tc-radar-map');
      if (mapContainer && !this.mapEngine) {
        this.mapEngine = new TownCenterMap('tc-radar-map', {
          onGeofenceCheck: (result) => this.handleMapGeofenceClick(result),
          onSelectEntity: (type, data) => this.handleMapSelectEntity(type, data)
        });
        this.mapEngine.init();
      }
    }, 150);
  }

  bindGlobalEvents() {
    // Navigation tabs
    document.querySelectorAll('[data-nav-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.getAttribute('data-nav-view');
        this.switchView(view);
      });
    });

    // Cart trigger
    const cartBtn = document.getElementById('cart-drawer-trigger');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        sound.playClick();
        this.toggleCartDrawer(true);
      });
    }

    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        sound.muted = !sound.muted;
        soundToggle.classList.toggle('text-zinc-600', sound.muted);
        soundToggle.classList.toggle('text-white', !sound.muted);
        if (!sound.muted) sound.playClick();
      });
    }
  }

  switchView(viewName) {
    sound.playClick();
    this.state.activeView = viewName;
    
    // Update nav tab styles
    document.querySelectorAll('[data-nav-view]').forEach(btn => {
      const isTarget = btn.getAttribute('data-nav-view') === viewName;
      btn.classList.toggle('tab-active', isTarget);
      btn.classList.toggle('text-zinc-400', !isTarget);
      btn.classList.toggle('text-black', isTarget);
    });

    this.renderActiveView();

    if (viewName === 'radar' && this.mapEngine) {
      setTimeout(() => {
        this.mapEngine.map.invalidateSize();
      }, 100);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderHeader() {
    const resSelectEl = document.getElementById('residence-header-picker');
    if (resSelectEl) {
      resSelectEl.innerHTML = RESIDENCES.map(r => `
        <option value="${r.id}" ${r.id === this.state.userResidence.id ? 'selected' : ''}>
          📍 ${r.name}
        </option>
      `).join('');

      resSelectEl.addEventListener('change', (e) => {
        const found = RESIDENCES.find(r => r.id === e.target.value);
        if (found) {
          this.state.userResidence = found;
          sound.playClick();
          this.showToast(`Residence updated to ${found.name}`);
          if (this.state.activeView === 'resident') {
            this.renderMerchantList();
          }
        }
      });
    }
  }

  renderActiveView() {
    const container = document.getElementById('main-app-content');
    if (!container) return;

    switch (this.state.activeView) {
      case 'resident':
        container.innerHTML = this.getResidentStoreViewHTML();
        this.bindResidentViewEvents();
        break;
      case 'courier':
        container.innerHTML = this.getCourierDeckViewHTML();
        this.bindCourierDeckEvents();
        break;
      case 'radar':
        container.innerHTML = this.getRadarMapViewHTML();
        this.bindRadarViewEvents();
        this.initMap();
        break;
      case 'membership':
        container.innerHTML = this.getMembershipViewHTML();
        this.bindMembershipEvents();
        break;
      case 'errand':
        container.innerHTML = this.getCustomErrandViewHTML();
        this.bindCustomErrandEvents();
        break;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // VIEW 1: RESIDENT STOREFRONT
  // ==========================================
  getResidentStoreViewHTML() {
    return `
      <div class="space-y-8 pb-20">
        <!-- Hero Banner: Town Center Hyper-Local Guarantee -->
        <div class="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950">
          <div class="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="max-w-xl space-y-3">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-cyan-400">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>TOWN CENTER RESIDENT NETWORK • 1.0 MILE MAXIMUM</span>
              </div>
              <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Direct to your door in <span class="text-white underline decoration-cyan-400 decoration-2 underline-offset-4">8–12 minutes</span> on wheels.
              </h1>
              <p class="text-sm text-zinc-300 leading-relaxed">
                Exclusively for residents of <strong>The Cosmopolitan, Westin, Studio 78, The Premier</strong> & Town Center hotels. 
                Delivered by your neighbors on OneWheels, cruiser boards, and e-bikes. Zero car traffic delays.
              </p>
              <div class="flex flex-wrap items-center gap-3 pt-2">
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-400"></i>
                  <span>$9.99/mo Unlimited Pass</span>
                </div>
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  <i data-lucide="heart-handshake" class="w-3.5 h-3.5 text-amber-400"></i>
                  <span>$5.00 Min Tip to Couriers</span>
                </div>
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                  <i data-lucide="zap" class="w-3.5 h-3.5 text-cyan-400"></i>
                  <span>5 Active Riders Nearby</span>
                </div>
              </div>
            </div>

            <!-- Quick Errand Action Box -->
            <div class="w-full md:w-auto p-4 rounded-xl bg-black/60 border border-white/15 space-y-3 shrink-0">
              <div class="flex items-center justify-between gap-4">
                <span class="text-xs font-mono text-zinc-400 uppercase">Need a Quick Plaza Errand?</span>
                <span class="px-1.5 py-0.5 rounded bg-cyan-950 text-[10px] font-mono text-cyan-300 border border-cyan-700">P2P</span>
              </div>
              <p class="text-xs text-zinc-300">Key card lockouts, lobby packages, dry cleaning or custom hauls.</p>
              <button onclick="window.DELIVERED_APP.switchView('errand')" class="w-full py-2 px-3 bg-white text-black font-semibold text-xs rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                <span>Create Custom Errand</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Wheel Speed Fleet Ticker -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-black border border-white/15 flex items-center justify-center text-cyan-400 text-lg">⚡</div>
            <div>
              <div class="text-[11px] font-mono text-zinc-400">ONEWHEELS</div>
              <div class="text-sm font-bold text-white">20 MPH Sidewalks</div>
            </div>
          </div>
          <div class="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-black border border-white/15 flex items-center justify-center text-amber-400 text-lg">🛹</div>
            <div>
              <div class="text-[11px] font-mono text-zinc-400">CRUISER BOARDS</div>
              <div class="text-sm font-bold text-white">Zero-Spill Carving</div>
            </div>
          </div>
          <div class="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-black border border-white/15 flex items-center justify-center text-emerald-400 text-lg">🔋</div>
            <div>
              <div class="text-[11px] font-mono text-zinc-400">E-BIKES (SUPER73)</div>
              <div class="text-sm font-bold text-white">Large Bag Capacity</div>
            </div>
          </div>
          <div class="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-black border border-white/15 flex items-center justify-center text-purple-400 text-lg">🚲</div>
            <div>
              <div class="text-[11px] font-mono text-zinc-400">FIXIE BIKES</div>
              <div class="text-sm font-bold text-white">Columbus St Sprints</div>
            </div>
          </div>
        </div>

        <!-- Category & Search Bar -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <!-- Category Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            ${['All', 'Dining', 'Cafe & Juice', 'Bodega & Essentials'].map(cat => `
              <button 
                class="category-filter-btn px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${this.state.activeCategory === cat ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-white/25'}"
                data-category="${cat}">
                ${cat}
              </button>
            `).join('')}
          </div>

          <!-- Search Input -->
          <div class="relative min-w-[240px]">
            <i data-lucide="search" class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              id="merchant-search-input" 
              placeholder="Search dishes, juices, snacks..." 
              value="${this.state.searchQuery}"
              class="w-full bg-zinc-900 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 font-sans"
            />
          </div>
        </div>

        <!-- Merchant List Grid -->
        <div id="merchant-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${this.getMerchantCardsHTML()}
        </div>
      </div>
    `;
  }

  getMerchantCardsHTML() {
    let list = MERCHANTS;
    if (this.state.activeCategory !== 'All') {
      list = list.filter(m => m.category === this.state.activeCategory);
    }
    if (this.state.searchQuery.trim()) {
      const q = this.state.searchQuery.toLowerCase();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.cuisine.toLowerCase().includes(q) ||
        m.items.some(item => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      return `
        <div class="col-span-full py-16 text-center space-y-3 glass-panel rounded-2xl border border-white/10">
          <i data-lucide="store" class="w-8 h-8 text-zinc-600 mx-auto"></i>
          <h3 class="text-base font-bold text-white">No Town Center spots match your search</h3>
          <p class="text-xs text-zinc-400">Try searching for "truffle", "cold pressed", "guacamole" or "energy drink".</p>
        </div>
      `;
    }

    return list.map(m => `
      <div class="group rounded-2xl glass-panel border border-white/10 overflow-hidden glass-panel-hover flex flex-col justify-between">
        <div>
          <!-- Card Header Image -->
          <div class="relative h-44 w-full overflow-hidden bg-zinc-950">
            <img src="${m.image}" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
            
            <div class="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-cyan-300 font-semibold">
              ${m.popularTag}
            </div>

            <div class="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-amber-300 flex items-center gap-1 font-bold">
              <span>★</span> <span>${m.rating}</span>
            </div>

            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-white leading-snug">${m.name}</h3>
                <p class="text-xs text-zinc-300">${m.cuisine}</p>
              </div>
            </div>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="grid grid-cols-2 border-y border-white/10 bg-zinc-950/60 p-2.5 text-[11px] font-mono">
            <div class="flex items-center gap-1.5 text-zinc-300">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-zinc-400"></i>
              <span>Prep: <strong>${m.prepTime}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 text-emerald-400 justify-end">
              <i data-lucide="zap" class="w-3.5 h-3.5"></i>
              <span>Roll: <strong>${m.courierRollTime}</strong></span>
            </div>
          </div>

          <!-- Featured Items Preview -->
          <div class="p-4 space-y-2.5">
            <div class="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Popular from ${m.name}</div>
            <div class="space-y-1.5">
              ${m.items.slice(0, 2).map(item => `
                <div class="flex items-center justify-between py-1 border-b border-white/5 text-xs">
                  <span class="text-zinc-200 font-medium truncate max-w-[200px]">${item.name}</span>
                  <span class="text-white font-mono font-bold shrink-0">$${item.price.toFixed(2)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="p-4 pt-0">
          <button 
            onclick="window.DELIVERED_APP.openMerchant('${m.id}')"
            class="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
            <span>View Full Menu & Order</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  bindResidentViewEvents() {
    // Category pills
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.playClick();
        this.state.activeCategory = btn.getAttribute('data-category');
        this.renderMerchantList();
        
        // Update active UI
        document.querySelectorAll('.category-filter-btn').forEach(b => {
          const isSelected = b.getAttribute('data-category') === this.state.activeCategory;
          b.className = `category-filter-btn px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${isSelected ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-white/25'}`;
        });
      });
    });

    // Search
    const searchInput = document.getElementById('merchant-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value;
        this.renderMerchantList();
      });
    }
  }

  renderMerchantList() {
    const grid = document.getElementById('merchant-grid');
    if (grid) {
      grid.innerHTML = this.getMerchantCardsHTML();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  openMerchant(merchantId) {
    sound.playClick();
    const merchant = MERCHANTS.find(m => m.id === merchantId);
    if (!merchant) return;

    this.state.selectedMerchant = merchant;
    this.renderMerchantModal(merchant);
  }

  renderMerchantModal(m) {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md" onclick="window.DELIVERED_APP.closeModal()"></div>

        <!-- Modal Dialog -->
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-white/20 bg-zinc-950 p-6 shadow-2xl z-10 space-y-6">
          <!-- Modal Header -->
          <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-white/15 text-[11px] font-mono text-cyan-400 mb-1.5">
                <span>📍 ${m.address} (Within 1-Mi Geofence)</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-white">${m.name}</h2>
              <p class="text-xs text-zinc-400">${m.cuisine} • Est. Courier Roll: <span class="text-emerald-400 font-mono font-bold">${m.courierRollTime}</span></p>
            </div>
            <button onclick="window.DELIVERED_APP.closeModal()" class="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Menu Items List -->
          <div class="space-y-4">
            <h3 class="text-xs font-mono uppercase tracking-wider text-zinc-400">Menu Items Available for Wheel Run</h3>
            <div class="space-y-3">
              ${m.items.map(item => `
                <div class="p-3.5 rounded-xl bg-zinc-900/70 border border-white/10 hover:border-white/25 transition-all flex items-start justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-white">${item.name}</span>
                      <span class="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400">${item.category}</span>
                    </div>
                    <p class="text-xs text-zinc-400">${item.desc}</p>
                    <div class="text-sm font-mono font-bold text-white pt-1">$${item.price.toFixed(2)}</div>
                  </div>
                  <button 
                    onclick="window.DELIVERED_APP.addToCart('${m.id}', '${item.id}')"
                    class="shrink-0 px-3 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5">
                    <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                    <span>Add</span>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Footer CTA -->
          <div class="flex items-center justify-between border-t border-white/10 pt-4">
            <div class="text-xs font-mono text-zinc-400">
              Deliver to: <strong class="text-white">${this.state.userResidence.name.split(' ')[0]} ${this.state.userResidence.name.split(' ')[1] || ''}</strong>
            </div>
            <button onclick="window.DELIVERED_APP.closeModal(); window.DELIVERED_APP.toggleCartDrawer(true);" class="py-2.5 px-5 rounded-xl bg-cyan-400 text-black font-bold text-xs hover:bg-cyan-300 transition-colors flex items-center gap-2">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>View Cart & Tip</span>
            </button>
          </div>
        </div>
      </div>
    `;

    modalContainer.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.classList.add('hidden');
      modalContainer.innerHTML = '';
    }
  }

  addToCart(merchantId, itemId) {
    const merchant = MERCHANTS.find(m => m.id === merchantId);
    if (!merchant) return;
    const item = merchant.items.find(i => i.id === itemId);
    if (!item) return;

    sound.playClick();
    const existing = this.state.cart.find(c => c.itemId === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.state.cart.push({
        merchantId: merchant.id,
        merchantName: merchant.name,
        merchantAddress: merchant.address,
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      });
    }

    this.updateCartCount();
    this.showToast(`Added ${item.name} to Cart`);
  }

  updateCartCount() {
    const totalCount = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count-badge');
    if (badge) {
      badge.textContent = totalCount;
      badge.classList.toggle('hidden', totalCount === 0);
    }
    this.renderCartDrawerContent();
  }

  toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      if (open) {
        drawer.classList.add('open');
        backdrop.classList.add('open');
        this.renderCartDrawerContent();
      } else {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
      }
    }
    if (window.lucide) window.lucide.createIcons();
  }

  renderCartDrawerContent() {
    const container = document.getElementById('cart-drawer-content');
    if (!container) return;

    if (this.state.cart.length === 0) {
      container.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-600">
            <i data-lucide="shopping-bag" class="w-8 h-8"></i>
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-bold text-white">Your Cart is Empty</h3>
            <p class="text-xs text-zinc-400">Select dishes, cold pressed juices, or bodega items from Town Center merchants.</p>
          </div>
          <button onclick="window.DELIVERED_APP.toggleCartDrawer(false)" class="py-2 px-4 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200">
            Browse Town Center
          </button>
        </div>
      `;
      return;
    }

    const subtotal = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = this.state.hasSubscriptionPass ? 0.00 : PRICING_RULES.nonMemberDeliveryFee;
    const tip = parseFloat(this.state.tipAmount) || 5.00;
    const total = subtotal + deliveryFee + tip;

    container.innerHTML = `
      <div class="flex flex-col h-full justify-between">
        <!-- Cart Items List -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Residence Dropoff Banner -->
          <div class="p-3.5 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
            <div class="flex items-center justify-between text-[11px] font-mono">
              <span class="text-zinc-400">DELIVERING TO</span>
              <span class="text-emerald-400 font-bold">1-MILE ZONE VERIFIED</span>
            </div>
            <div class="text-xs font-bold text-white">${this.state.userResidence.name}</div>
            <div class="grid grid-cols-2 gap-2 pt-1">
              <input type="text" id="cart-floor-input" placeholder="Floor (e.g. 8)" value="${this.state.userFloor}" class="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white" />
              <input type="text" id="cart-unit-input" placeholder="Unit # (e.g. 814)" value="${this.state.userUnit}" class="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white" />
            </div>
            <input type="text" id="cart-notes-input" placeholder="Elevator buzz code, doormat drop..." value="${this.state.userDeliveryNotes}" class="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500" />
          </div>

          <!-- Items Breakdown -->
          <div class="space-y-3">
            <div class="text-xs font-mono uppercase tracking-wider text-zinc-400">Items Ordered</div>
            ${this.state.cart.map((item, idx) => `
              <div class="p-3 rounded-xl bg-zinc-900/50 border border-white/10 flex items-center justify-between gap-3">
                <div class="space-y-0.5 flex-1 min-w-0">
                  <div class="text-xs font-bold text-white truncate">${item.name}</div>
                  <div class="text-[10px] font-mono text-zinc-400">${item.merchantName}</div>
                  <div class="text-xs font-mono font-semibold text-white">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button onclick="window.DELIVERED_APP.changeItemQuantity(${idx}, -1)" class="w-6 h-6 rounded bg-zinc-800 border border-white/10 text-xs text-white flex items-center justify-center hover:bg-zinc-700">-</button>
                  <span class="text-xs font-mono font-bold text-white w-4 text-center">${item.quantity}</span>
                  <button onclick="window.DELIVERED_APP.changeItemQuantity(${idx}, 1)" class="w-6 h-6 rounded bg-zinc-800 border border-white/10 text-xs text-white flex items-center justify-center hover:bg-zinc-700">+</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Courier Wheel Preference -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>WHEEL SPEED PREFERENCE</span>
              <span class="text-cyan-400 text-[10px]">ALL IN 8-12 MIN</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button onclick="window.DELIVERED_APP.setWheelPreference('any')" class="p-2 rounded-lg text-center border ${this.state.preferredWheels === 'all' || this.state.preferredWheels === 'any' ? 'bg-white text-black border-white font-bold' : 'bg-zinc-900 text-zinc-300 border-white/10'} text-[11px]">
                ⚡ Next Available
              </button>
              <button onclick="window.DELIVERED_APP.setWheelPreference('onewheel')" class="p-2 rounded-lg text-center border ${this.state.preferredWheels === 'onewheel' ? 'bg-white text-black border-white font-bold' : 'bg-zinc-900 text-zinc-300 border-white/10'} text-[11px]">
                ⚡ OneWheel GT
              </button>
              <button onclick="window.DELIVERED_APP.setWheelPreference('skateboard')" class="p-2 rounded-lg text-center border ${this.state.preferredWheels === 'skateboard' ? 'bg-white text-black border-white font-bold' : 'bg-zinc-900 text-zinc-300 border-white/10'} text-[11px]">
                🛹 Cruiser Board
              </button>
            </div>
          </div>

          <!-- Tip Selector (STRICT $5.00 MINIMUM) -->
          <div class="p-4 rounded-xl bg-zinc-950 border border-white/20 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-mono font-bold text-white uppercase">Courier Tip</span>
                <span class="block text-[10px] text-amber-400 font-mono font-medium">⚠️ $5.00 Strict Town Center Minimum</span>
              </div>
              <span class="text-xs font-mono font-bold text-emerald-400">100% to Rider</span>
            </div>

            <!-- Tip presets -->
            <div class="grid grid-cols-4 gap-2">
              ${[5.00, 7.00, 10.00, 15.00].map(amt => `
                <button 
                  onclick="window.DELIVERED_APP.setTipAmount(${amt})"
                  class="tip-pill py-2 rounded-lg text-xs font-mono text-center ${Math.abs(this.state.tipAmount - amt) < 0.01 ? 'selected' : 'bg-zinc-900 text-zinc-300'}">
                  $${amt.toFixed(2)}
                </button>
              `).join('')}
            </div>

            <!-- Custom Tip Input -->
            <div class="flex items-center gap-2 pt-1">
              <span class="text-xs font-mono text-zinc-400">Custom ($5+ min):</span>
              <div class="relative flex-1">
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">$</span>
                <input 
                  type="number" 
                  min="5" 
                  step="1" 
                  id="custom-tip-field" 
                  value="${this.state.tipAmount}" 
                  onchange="window.DELIVERED_APP.setCustomTip(this.value)"
                  class="w-full bg-zinc-900 border border-white/15 rounded-lg pl-6 pr-2 py-1.5 text-xs text-white font-mono" 
                />
              </div>
            </div>
          </div>

          <!-- Subscription Pass Status -->
          <div class="p-3 rounded-xl bg-gradient-to-r from-zinc-900 to-black border border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <i data-lucide="badge-check" class="w-4 h-4 text-cyan-400"></i>
              <div>
                <div class="text-xs font-bold text-white">Town Center Resident Pass</div>
                <div class="text-[10px] text-zinc-400 font-mono">${this.state.hasSubscriptionPass ? '$0 Delivery Fees Active ($9.99/mo)' : '$2.50 non-member fee applies'}</div>
              </div>
            </div>
            <button onclick="window.DELIVERED_APP.toggleSubscriptionState()" class="text-[11px] font-mono text-cyan-400 underline decoration-cyan-400/50 hover:text-white">
              ${this.state.hasSubscriptionPass ? 'Manage' : 'Activate Pass'}
            </button>
          </div>
        </div>

        <!-- Cart Footer Checkout Total -->
        <div class="p-6 border-t border-white/10 bg-zinc-950 space-y-4">
          <div class="space-y-1.5 text-xs font-mono">
            <div class="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span class="text-white">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-zinc-400">
              <span>Town Center Run Fee</span>
              <span class="${this.state.hasSubscriptionPass ? 'text-emerald-400 font-bold' : 'text-white'}">
                ${this.state.hasSubscriptionPass ? '$0.00 (Pass Member)' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div class="flex justify-between text-zinc-400">
              <span>Courier Tip (Guaranteed)</span>
              <span class="text-amber-400 font-bold">$${tip.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
              <span>Total Payout</span>
              <span class="text-base font-mono text-cyan-400">$${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onclick="window.DELIVERED_APP.submitOrder()"
            class="w-full py-3 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <i data-lucide="zap" class="w-4 h-4 text-black"></i>
            <span>Dispatch Town Center Courier • $${total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    `;

    // Bind inputs
    const floorInput = document.getElementById('cart-floor-input');
    if (floorInput) floorInput.addEventListener('input', (e) => this.state.userFloor = e.target.value);

    const unitInput = document.getElementById('cart-unit-input');
    if (unitInput) unitInput.addEventListener('input', (e) => this.state.userUnit = e.target.value);

    const notesInput = document.getElementById('cart-notes-input');
    if (notesInput) notesInput.addEventListener('input', (e) => this.state.userDeliveryNotes = e.target.value);
  }

  changeItemQuantity(index, delta) {
    sound.playClick();
    if (this.state.cart[index]) {
      this.state.cart[index].quantity += delta;
      if (this.state.cart[index].quantity <= 0) {
        this.state.cart.splice(index, 1);
      }
    }
    this.updateCartCount();
  }

  setWheelPreference(pref) {
    sound.playClick();
    this.state.preferredWheels = pref;
    this.renderCartDrawerContent();
    if (window.lucide) window.lucide.createIcons();
  }

  setTipAmount(amount) {
    if (amount < 5.00) {
      amount = 5.00;
      sound.playGeofenceWarning();
      this.showToast('Town Center rule: $5.00 minimum tip required for couriers.');
    } else {
      sound.playTipTick();
    }
    this.state.tipAmount = amount;
    this.renderCartDrawerContent();
    if (window.lucide) window.lucide.createIcons();
  }

  setCustomTip(value) {
    let num = parseFloat(value);
    if (isNaN(num) || num < 5.00) {
      num = 5.00;
      sound.playGeofenceWarning();
      this.showToast('Town Center rule: $5.00 minimum tip required for couriers.');
    } else {
      sound.playTipTick();
    }
    this.state.tipAmount = num;
    this.renderCartDrawerContent();
    if (window.lucide) window.lucide.createIcons();
  }

  toggleSubscriptionState() {
    sound.playClick();
    this.state.hasSubscriptionPass = !this.state.hasSubscriptionPass;
    this.showToast(this.state.hasSubscriptionPass ? 'Town Center Resident Pass Active!' : 'Switched to Single Run Non-Member');
    this.renderCartDrawerContent();
    if (window.lucide) window.lucide.createIcons();
  }

  submitOrder() {
    if (this.state.cart.length === 0) return;
    sound.playSuccess();
    
    // Choose closest simulated courier
    const assignedCourier = COURIERS[Math.floor(Math.random() * COURIERS.length)];
    const merchantId = this.state.cart[0].merchantId;
    const merchant = MERCHANTS.find(m => m.id === merchantId) || MERCHANTS[0];

    const newOrder = {
      orderId: `TC-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date(),
      items: [...this.state.cart],
      merchant,
      residence: this.state.userResidence,
      floor: this.state.userFloor,
      unit: this.state.userUnit,
      notes: this.state.userDeliveryNotes,
      tip: this.state.tipAmount,
      courier: assignedCourier,
      status: 'Dispatching Courier',
      etaMinutes: 9
    };

    this.state.activeOrder = newOrder;
    this.state.orderProgressStep = 0;
    this.state.cart = [];
    this.updateCartCount();
    this.toggleCartDrawer(false);

    // Open live tracking modal
    this.openOrderTrackingModal();
    this.startOrderSimulation();
  }

  startOrderSimulation() {
    if (this.state.orderTimer) clearInterval(this.state.orderTimer);

    const steps = [
      { step: 1, label: 'Rolling to Merchant on Wheels', delay: 4000 },
      { step: 2, label: 'Order Bag Sealed & Packed in Thermal Kit', delay: 8000 },
      { step: 3, label: 'Carving Sidewalk to Residence Plaza', delay: 13000 },
      { step: 4, label: 'Entering Elevator / Arrived at Door', delay: 18000 },
      { step: 5, label: 'Delivered to Doorstep! Enjoy your meal 🛹', delay: 24000 }
    ];

    steps.forEach(({ step, label, delay }) => {
      setTimeout(() => {
        if (this.state.activeOrder) {
          this.state.orderProgressStep = step;
          this.state.activeOrder.status = label;
          sound.playDispatchAlert();
          this.renderOrderTrackingContent();
          if (step === 5) {
            sound.playSuccess();
          }
        }
      }, delay);
    });
  }

  openOrderTrackingModal() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-black/85 backdrop-blur-lg" onclick="window.DELIVERED_APP.closeModal()"></div>
        <div id="order-tracking-body" class="relative w-full max-w-lg glass-panel rounded-2xl border border-white/20 bg-zinc-950 p-6 shadow-2xl z-10 space-y-6">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    modalContainer.classList.remove('hidden');
    this.renderOrderTrackingContent();
  }

  renderOrderTrackingContent() {
    const body = document.getElementById('order-tracking-body');
    if (!body || !this.state.activeOrder) return;

    const ord = this.state.activeOrder;
    const step = this.state.orderProgressStep;

    body.innerHTML = `
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${step === 5 ? 'bg-emerald-400' : 'bg-cyan-400 animate-ping'}"></span>
            <span class="text-xs font-mono font-bold text-white uppercase tracking-wider">${ord.orderId}</span>
          </div>
          <h3 class="text-lg font-bold text-white">${ord.status}</h3>
        </div>
        <button onclick="window.DELIVERED_APP.closeModal()" class="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Step Progress Bar -->
      <div class="space-y-2">
        <div class="flex justify-between text-[11px] font-mono text-zinc-400">
          <span>DISPATCHED</span>
          <span>MERCHANT</span>
          <span>WHEELS ROLLING</span>
          <span>DOORSTEP</span>
        </div>
        <div class="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
          <div class="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 transition-all duration-700" style="width: ${Math.min(100, Math.max(10, step * 20))}%"></div>
        </div>
      </div>

      <!-- Assigned Courier Card -->
      <div class="p-4 rounded-xl bg-zinc-900 border border-white/15 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="${ord.courier.avatar}" class="w-12 h-12 rounded-full border-2 border-white/20 object-cover" />
            <div>
              <h4 class="text-sm font-bold text-white">${ord.courier.name}</h4>
              <p class="text-xs font-mono text-cyan-400">${ord.courier.vehicle}</p>
              <p class="text-[10px] text-zinc-400">${ord.courier.homeResidence} Resident • ★ ${ord.courier.rating}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs font-mono text-zinc-400">EST. ARRIVAL</div>
            <div class="text-base font-mono font-bold text-emerald-400">${Math.max(1, 9 - step * 2)} min</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px] font-mono bg-black/60 p-2.5 rounded-lg border border-white/5">
          <div><span class="text-zinc-500">FROM:</span> <span class="text-white">${ord.merchant.name}</span></div>
          <div><span class="text-zinc-500">TO:</span> <span class="text-white">${ord.residence.name.split(' ')[0]} #${ord.unit}</span></div>
        </div>
      </div>

      <!-- Live Radar Telemetry snippet -->
      <div class="p-3.5 rounded-xl bg-black/80 border border-white/10 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <i data-lucide="radio" class="w-4 h-4 text-cyan-400 animate-pulse"></i>
          <span class="text-zinc-300">Courier Telemetry: <strong>18.4 MPH</strong></span>
        </div>
        <span class="text-amber-400">$${ord.tip.toFixed(2)} Tip Locked</span>
      </div>

      ${step === 5 ? `
        <button onclick="window.DELIVERED_APP.closeModal(); window.DELIVERED_APP.showToast('Thank you for supporting Town Center micro-couriers!');" class="w-full py-3 rounded-xl bg-emerald-400 text-black font-bold text-sm hover:bg-emerald-300 transition-colors">
          Mark Received & Close
        </button>
      ` : `
        <button onclick="window.DELIVERED_APP.switchView('radar'); window.DELIVERED_APP.closeModal();" class="w-full py-2.5 rounded-xl bg-zinc-900 border border-white/20 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
          <i data-lucide="map" class="w-4 h-4"></i>
          <span>Track on Live Town Center Radar</span>
        </button>
      `}
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // VIEW 2: COURIER DISPATCH DECK ("THE WHEELROOM")
  // ==========================================
  getCourierDeckViewHTML() {
    return `
      <div class="space-y-8 pb-20">
        <!-- Courier Top HUD -->
        <div class="p-6 rounded-2xl glass-panel border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>COURIER TERMINAL // TC WHEELROOM ACTIVE</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Town Center Resident Courier Hub</h2>
            <p class="text-xs text-zinc-400">Exclusive to riders residing in Town Center buildings. Guaranteed $5.00+ tip on every run.</p>
          </div>

          <!-- Shift Status & Vehicle Picker -->
          <div class="flex flex-wrap items-center gap-4 bg-black/60 p-4 rounded-xl border border-white/10">
            <div>
              <div class="text-[10px] font-mono text-zinc-400">SHIFT STATUS</div>
              <button id="courier-shift-toggle" class="mt-1 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${this.state.courierOnline ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-zinc-800 text-zinc-400'}">
                ${this.state.courierOnline ? '🟢 ONLINE & ROLLING' : '🔴 OFFLINE'}
              </button>
            </div>

            <div>
              <div class="text-[10px] font-mono text-zinc-400">PRIMARY WHEELS</div>
              <select id="courier-vehicle-select" class="mt-1 bg-zinc-900 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono">
                <option value="onewheel" ${this.state.selectedVehicle === 'onewheel' ? 'selected' : ''}>⚡ OneWheel GT</option>
                <option value="skateboard" ${this.state.selectedVehicle === 'skateboard' ? 'selected' : ''}>🛹 Cruiser Skateboard</option>
                <option value="ebike" ${this.state.selectedVehicle === 'ebike' ? 'selected' : ''}>🔋 Super73 E-Bike</option>
                <option value="bike" ${this.state.selectedVehicle === 'bike' ? 'selected' : ''}>🚲 Fixie / Road Bike</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Courier Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
          <div class="p-4 rounded-xl bg-zinc-900/60 border border-white/10">
            <div class="text-xs text-zinc-400">TODAY'S EARNINGS</div>
            <div class="text-2xl font-bold text-emerald-400 mt-1">$${this.state.courierEarningsToday.toFixed(2)}</div>
            <div class="text-[10px] text-zinc-500 mt-1">100% Tips + Micro-Fees</div>
          </div>
          <div class="p-4 rounded-xl bg-zinc-900/60 border border-white/10">
            <div class="text-xs text-zinc-400">RUNS COMPLETED</div>
            <div class="text-2xl font-bold text-white mt-1">${this.state.courierRunsToday}</div>
            <div class="text-[10px] text-zinc-500 mt-1">Avg 8.4 mins per run</div>
          </div>
          <div class="p-4 rounded-xl bg-zinc-900/60 border border-white/10">
            <div class="text-xs text-zinc-400">MINIMUM TIP MET</div>
            <div class="text-2xl font-bold text-cyan-400 mt-1">100%</div>
            <div class="text-[10px] text-zinc-500 mt-1">$5.00 Floor Guaranteed</div>
          </div>
          <div class="p-4 rounded-xl bg-zinc-900/60 border border-white/10">
            <div class="text-xs text-zinc-400">ZONE COMPLIANCE</div>
            <div class="text-2xl font-bold text-white mt-1">&lt; 1.0 mi</div>
            <div class="text-[10px] text-zinc-500 mt-1">Town Center Geofence</div>
          </div>
        </div>

        <!-- Active Dispatch Stream -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i data-lucide="radio" class="w-4 h-4 text-cyan-400 animate-pulse"></i>
              <h3 class="text-base font-bold text-white">Live Town Center Dispatch Queue</h3>
            </div>
            <span class="text-xs font-mono text-zinc-400">${this.state.incomingQueue.length} Orders Available Nearby</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${this.state.incomingQueue.map((job, idx) => `
              <div class="p-5 rounded-2xl glass-panel border border-white/15 flex flex-col justify-between space-y-4 glass-panel-hover">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-400 font-bold">${job.urgency}</span>
                    <span class="text-xs font-mono text-zinc-400">${job.distance} away</span>
                  </div>

                  <div>
                    <h4 class="text-base font-bold text-white">${job.merchantName}</h4>
                    <p class="text-xs text-zinc-400">➔ ${job.residenceName}</p>
                  </div>

                  <div class="p-2.5 rounded-lg bg-black/60 border border-white/5 text-xs text-zinc-300 font-sans">
                    ${job.itemsSummary}
                  </div>

                  <div class="flex items-center justify-between text-xs font-mono bg-zinc-900 p-2.5 rounded-lg border border-white/5">
                    <span class="text-zinc-400">Payout Breakdown</span>
                    <span class="text-emerald-400 font-bold">$${job.baseFee.toFixed(2)} + $${job.tip.toFixed(2)} Tip = <strong class="text-white text-sm">$${job.payout.toFixed(2)}</strong></span>
                  </div>
                </div>

                <button 
                  onclick="window.DELIVERED_APP.acceptCourierJob(${idx})"
                  class="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                  <i data-lucide="check" class="w-4 h-4"></i>
                  <span>Accept Run ($${job.payout.toFixed(2)})</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  bindCourierDeckEvents() {
    const shiftToggle = document.getElementById('courier-shift-toggle');
    if (shiftToggle) {
      shiftToggle.addEventListener('click', () => {
        sound.playClick();
        this.state.courierOnline = !this.state.courierOnline;
        this.renderActiveView();
        this.showToast(this.state.courierOnline ? 'You are now ONLINE for Town Center dispatches!' : 'Shift ended. Great work today!');
      });
    }

    const vehicleSelect = document.getElementById('courier-vehicle-select');
    if (vehicleSelect) {
      vehicleSelect.addEventListener('change', (e) => {
        sound.playClick();
        this.state.selectedVehicle = e.target.value;
        this.showToast(`Primary vehicle updated to ${e.target.value}`);
      });
    }
  }

  acceptCourierJob(index) {
    const job = this.state.incomingQueue[index];
    if (!job) return;

    sound.playSuccess();
    this.state.incomingQueue.splice(index, 1);
    this.state.courierEarningsToday += job.payout;
    this.state.courierRunsToday += 1;
    this.showToast(`Accepted run for ${job.merchantName}! Total payout +$${job.payout.toFixed(2)} credited.`);
    this.renderActiveView();
  }

  // ==========================================
  // VIEW 3: LIVE RADAR & 1-MILE GEOFENCE MAP
  // ==========================================
  getRadarMapViewHTML() {
    return `
      <div class="space-y-6 pb-20">
        <!-- Radar Map Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-white/10">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <h2 class="text-lg font-bold text-white">Live Town Center Micro-Mobility Radar</h2>
            </div>
            <p class="text-xs text-zinc-400">Real-time GPS telemetry of OneWheels, skateboards & e-bikes within the 1.0-mile radius zone.</p>
          </div>

          <div class="flex items-center gap-2 text-xs font-mono">
            <span class="px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-emerald-400">● 5 Couriers Active</span>
            <span class="px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-cyan-400">⭕ 1.0 Mi Geofence</span>
          </div>
        </div>

        <!-- Leaflet Map Container -->
        <div class="relative w-full h-[520px] rounded-2xl overflow-hidden border border-white/20 glass-panel shadow-2xl">
          <div id="tc-radar-map" class="w-full h-full"></div>
          
          <!-- Map Overlay HUD Controls -->
          <div class="absolute top-4 left-4 z-[400] max-w-xs space-y-2 pointer-events-auto">
            <div class="p-3 rounded-xl bg-black/90 backdrop-blur-md border border-white/20 text-xs font-mono space-y-1.5 shadow-xl">
              <div class="flex items-center justify-between text-cyan-400 font-bold">
                <span>ZONE TELEMETRY</span>
                <span>ZONE 0</span>
              </div>
              <p class="text-[11px] text-zinc-400">Click anywhere on the map to test 1-mile geofence compliance.</p>
              <div id="geofence-live-result" class="text-[11px] text-emerald-400 font-bold pt-1 border-t border-white/10">
                Ready for query...
              </div>
            </div>
          </div>

          <!-- Legend Bar -->
          <div class="absolute bottom-4 left-4 z-[400] flex items-center gap-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-mono pointer-events-auto">
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> <span>Residences</span></div>
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400"></span> <span>Dining</span></div>
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-cyan-400"></span> <span>Bodega/Essentials</span></div>
            <div class="flex items-center gap-1.5"><span class="text-xs">⚡</span> <span>Riders</span></div>
          </div>
        </div>

        <!-- Quick Building Direct Connect -->
        <div class="space-y-3">
          <h3 class="text-xs font-mono uppercase tracking-wider text-zinc-400">Direct Connect Residences & Hotels</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            ${RESIDENCES.map(res => `
              <button 
                onclick="window.DELIVERED_APP.focusMapLocation(${res.lat}, ${res.lng}, '${res.name}')"
                class="p-3 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-white/30 text-left transition-all">
                <div class="text-xs font-bold text-white truncate">${res.name}</div>
                <div class="text-[10px] font-mono text-zinc-400">${res.floors} Floors • ${res.units} Units</div>
                <div class="text-[10px] font-mono text-emerald-400 mt-1">${res.activeCouriers} Couriers In-Building</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  bindRadarViewEvents() {}

  handleMapGeofenceClick(res) {
    const el = document.getElementById('geofence-live-result');
    if (!el) return;

    if (res.isWithinZone) {
      sound.playClick();
      el.innerHTML = `<span class="text-emerald-400">✓ ${res.distanceMiles} mi from Plaza — INSIDE 1.0-Mile Delivery Zone</span>`;
    } else {
      sound.playGeofenceWarning();
      el.innerHTML = `<span class="text-red-400">✗ ${res.distanceMiles} mi from Plaza — OUTSIDE 1.0-Mile Limit</span>`;
    }
  }

  handleMapSelectEntity(type, entity) {
    sound.playClick();
    if (type === 'merchant') {
      this.openMerchant(entity.id);
    } else if (type === 'residence') {
      this.state.userResidence = entity;
      this.showToast(`Selected ${entity.name} as destination residence.`);
    }
  }

  focusMapLocation(lat, lng, name) {
    sound.playClick();
    if (this.mapEngine) {
      this.mapEngine.focusCoordinates(lat, lng, 18);
      this.showToast(`Focused map on ${name}`);
    }
  }

  // ==========================================
  // VIEW 4: RESIDENT MEMBERSHIP & VERIFICATION
  // ==========================================
  getMembershipViewHTML() {
    return `
      <div class="space-y-8 pb-20 max-w-4xl mx-auto">
        <!-- Membership Hero Card -->
        <div class="p-8 rounded-3xl glass-panel border border-white/15 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-center space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-xs font-mono text-cyan-300">
            <span>🛡️ OFFICIAL TOWN CENTER RESIDENT MEMBERSHIP</span>
          </div>

          <div class="space-y-2 max-w-lg mx-auto">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white">The $9.99/Month Unlimited Town Center Pass</h2>
            <p class="text-sm text-zinc-300">
              Never pay a delivery fee in Town Center again. Zero surge pricing, priority sidewalk courier dispatch, and direct building elevator handoff.
            </p>
          </div>

          <!-- Interactive Plan Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto pt-4">
            <!-- Monthly -->
            <div class="p-6 rounded-2xl bg-zinc-900 border ${this.state.subscriptionPlan === 'monthly' ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-white/10'} space-y-4 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-mono text-zinc-400">MONTH-TO-MONTH</span>
                  <span class="px-2 py-0.5 rounded bg-cyan-950 text-[10px] font-mono text-cyan-300 border border-cyan-700">Most Flexible</span>
                </div>
                <div class="text-3xl font-extrabold text-white">$9.99 <span class="text-xs text-zinc-400 font-normal">/ month</span></div>
                <ul class="text-xs text-zinc-300 space-y-2 font-mono pt-2">
                  <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> $0 Delivery Fees on all runs</li>
                  <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> 100% Guaranteed $5 min tip compliance</li>
                  <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> Unlimited P2P errands & lobby fetches</li>
                </ul>
              </div>
              <button onclick="window.DELIVERED_APP.selectPlan('monthly')" class="w-full py-2.5 rounded-xl ${this.state.subscriptionPlan === 'monthly' ? 'bg-white text-black font-bold' : 'bg-zinc-800 text-white'} text-xs transition-all">
                ${this.state.subscriptionPlan === 'monthly' ? '✓ Current Plan Selected' : 'Choose Monthly'}
              </button>
            </div>

            <!-- Annual -->
            <div class="p-6 rounded-2xl bg-zinc-900 border ${this.state.subscriptionPlan === 'annual' ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-white/10'} space-y-4 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-mono text-amber-400 font-bold">ANNUAL VIP</span>
                  <span class="px-2 py-0.5 rounded bg-amber-950 text-[10px] font-mono text-amber-300 border border-amber-700">Save 25%</span>
                </div>
                <div class="text-3xl font-extrabold text-white">$89.00 <span class="text-xs text-zinc-400 font-normal">/ year</span></div>
                <ul class="text-xs text-zinc-300 space-y-2 font-mono pt-2">
                  <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> Everything in Monthly</li>
                  <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> Free TC Courier Reflective Keychain</li>
                  <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> VIP OneWheel Carve Ride-Along Intro</li>
                </ul>
              </div>
              <button onclick="window.DELIVERED_APP.selectPlan('annual')" class="w-full py-2.5 rounded-xl ${this.state.subscriptionPlan === 'annual' ? 'bg-white text-black font-bold' : 'bg-zinc-800 text-white'} text-xs transition-all">
                ${this.state.subscriptionPlan === 'annual' ? '✓ Selected Annual' : 'Choose Annual'}
              </button>
            </div>
          </div>
        </div>

        <!-- Resident Verification Module -->
        <div class="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div class="flex items-center gap-2">
            <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400"></i>
            <h3 class="text-base font-bold text-white">Residence & Key Fob Verification</h3>
          </div>
          <p class="text-xs text-zinc-400">
            To preserve hyper-local speed and security, only residents and guests of verified Town Center addresses can place orders and deliver.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-xl bg-black/60 border border-white/10 space-y-1">
              <div class="text-xs font-bold text-white">Building Selected</div>
              <div class="text-sm font-mono text-cyan-400">${this.state.userResidence.name}</div>
            </div>
            <div class="p-4 rounded-xl bg-black/60 border border-white/10 space-y-1">
              <div class="text-xs font-bold text-white">Verification Status</div>
              <div class="text-sm font-mono text-emerald-400 font-bold">✓ Active Key Fob Verified</div>
            </div>
            <div class="p-4 rounded-xl bg-black/60 border border-white/10 space-y-1">
              <div class="text-xs font-bold text-white">Monthly Savings</div>
              <div class="text-sm font-mono text-white">$42.50 vs Standard Apps</div>
            </div>
          </div>
        </div>

        <!-- Manifesto / FAQ -->
        <div class="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">Why Town Center Virginia Beach Only?</h3>
          <p>
            Traditional delivery apps send drivers in cars who struggle with parking garages, traffic lights on Virginia Beach Blvd, and complex high-rise security.
            Our couriers already live in The Cosmopolitan, Westin, and Studio 78. They roll down the elevator, carve across the plaza on a OneWheel or skateboard, grab your order from Yard House or Cold Pressed in 3 minutes, and bring it straight to your door.
          </p>
          <p>
            The <strong>$5.00 strict minimum tip</strong> guarantees our local riders make $25-$40/hr on light wheels, ensuring our fleet stays ready 24/7.
          </p>
        </div>
      </div>
    `;
  }

  bindMembershipEvents() {}

  selectPlan(plan) {
    sound.playClick();
    this.state.subscriptionPlan = plan;
    this.state.hasSubscriptionPass = true;
    this.showToast(`Selected ${plan === 'annual' ? 'Annual VIP ($89/yr)' : 'Monthly Pass ($9.99/mo)'}`);
    this.renderActiveView();
  }

  // ==========================================
  // VIEW 5: CUSTOM ERRANDS / P2P MICRO-TASKS
  // ==========================================
  getCustomErrandViewHTML() {
    return `
      <div class="space-y-8 pb-20 max-w-3xl mx-auto">
        <div class="p-6 rounded-2xl glass-panel border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <span>⚡ 1-MILE TOWN CENTER CONCIERGE & P2P DROP</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Create a Custom Plaza Errand</h2>
          <p class="text-xs text-zinc-300">
            Have a neighbor on a OneWheel, skateboard, or bike grab your package from the lobby locker, retrieve keys, or pick up an order anywhere in Town Center.
          </p>
        </div>

        <!-- Quick Errand Templates -->
        <div class="space-y-3">
          <div class="text-xs font-mono uppercase tracking-wider text-zinc-400">Quick Errand Templates</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${ERRAND_TEMPLATES.map(tmpl => `
              <div class="p-4 rounded-xl glass-panel border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between space-y-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <i data-lucide="${tmpl.icon}" class="w-4 h-4 text-cyan-400"></i>
                    <h4 class="text-xs font-bold text-white">${tmpl.title}</h4>
                  </div>
                  <p class="text-[11px] text-zinc-400">${tmpl.desc}</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-white/5">
                  <span class="text-[10px] font-mono text-zinc-400">Est: <strong>${tmpl.estimatedTime}</strong></span>
                  <button 
                    onclick="window.DELIVERED_APP.applyErrandTemplate('${tmpl.id}')"
                    class="py-1.5 px-3 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200">
                    Use Template
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Custom Errand Builder Form -->
        <div class="p-6 rounded-2xl glass-panel border border-white/15 space-y-5 bg-zinc-950">
          <h3 class="text-sm font-bold text-white font-mono uppercase tracking-wider">Custom Errand Specifications</h3>

          <div class="space-y-4 text-xs font-sans">
            <div>
              <label class="block text-zinc-400 font-mono mb-1">PICKUP LOCATION (Within 1 Mile)</label>
              <input type="text" id="errand-pickup" placeholder="e.g., Cosmopolitan Package Locker / Town Center Cleaners Market St" class="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2.5 text-white" />
            </div>

            <div>
              <label class="block text-zinc-400 font-mono mb-1">DROPOFF RESIDENCE & UNIT</label>
              <input type="text" id="errand-dropoff" value="${this.state.userResidence.name}, Floor ${this.state.userFloor}, Unit ${this.state.userUnit}" class="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2.5 text-white" />
            </div>

            <div>
              <label class="block text-zinc-400 font-mono mb-1">TASK INSTRUCTIONS / LOCKER CODES</label>
              <textarea id="errand-instructions" rows="3" placeholder="Describe the errand: e.g., Locker code 7482 at Cosmo Luxer One room, bring up to 8th floor door." class="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2.5 text-white"></textarea>
            </div>

            <!-- Tip guarantee -->
            <div class="p-4 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-white font-mono">COURIER TIP OFFER</span>
                <span class="block text-[10px] text-amber-400 font-mono">$5.00 Strict Minimum</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-zinc-400">$</span>
                <input type="number" id="errand-tip-input" min="5" value="6.00" class="w-20 bg-black border border-white/20 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold" />
              </div>
            </div>
          </div>

          <button 
            onclick="window.DELIVERED_APP.submitCustomErrand()"
            class="w-full py-3 rounded-xl bg-cyan-400 text-black font-extrabold text-xs hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2">
            <i data-lucide="zap" class="w-4 h-4"></i>
            <span>Broadcast Errand to Nearby Riders</span>
          </button>
        </div>
      </div>
    `;
  }

  bindCustomErrandEvents() {}

  applyErrandTemplate(templateId) {
    sound.playClick();
    const tmpl = ERRAND_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;

    const pickupEl = document.getElementById('errand-pickup');
    const instrEl = document.getElementById('errand-instructions');
    const tipEl = document.getElementById('errand-tip-input');

    if (pickupEl) pickupEl.value = tmpl.title.includes('Cleaners') ? 'Town Center Cleaners (Market St)' : `${this.state.userResidence.name} Lobby / Package Room`;
    if (instrEl) instrEl.value = tmpl.desc;
    if (tipEl) tipEl.value = tmpl.defaultTip.toFixed(2);

    this.showToast(`Applied ${tmpl.title} template.`);
  }

  submitCustomErrand() {
    const pickupEl = document.getElementById('errand-pickup');
    const instrEl = document.getElementById('errand-instructions');
    const tipEl = document.getElementById('errand-tip-input');

    const pickup = pickupEl ? pickupEl.value.trim() : '';
    const instructions = instrEl ? instrEl.value.trim() : '';
    const tip = tipEl ? parseFloat(tipEl.value) : 6.00;

    if (!pickup || !instructions) {
      sound.playGeofenceWarning();
      this.showToast('Please enter both pickup location and task instructions.');
      return;
    }

    if (tip < 5.00) {
      sound.playGeofenceWarning();
      this.showToast('Town Center minimum tip is $5.00 for couriers.');
      return;
    }

    sound.playSuccess();
    const assignedCourier = COURIERS[0];

    this.state.activeOrder = {
      orderId: `ERR-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date(),
      items: [{ name: `Custom Errand: ${pickup}`, price: 0.00, quantity: 1 }],
      merchant: { name: pickup, address: 'Town Center Virginia Beach' },
      residence: this.state.userResidence,
      floor: this.state.userFloor,
      unit: this.state.userUnit,
      notes: instructions,
      tip: tip,
      courier: assignedCourier,
      status: 'Courier Dispatched on OneWheel',
      etaMinutes: 7
    };

    this.state.orderProgressStep = 1;
    this.openOrderTrackingModal();
    this.startOrderSimulation();
    this.showToast('Custom errand broadcasted! Courier rolling.');
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    toast.querySelector('#toast-text').textContent = message;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-24', 'opacity-0');
    }, 3200);
  }
}

// Instantiate and expose globally
window.DELIVERED_APP = new DeliveredApp();
document.addEventListener('DOMContentLoaded', () => {
  window.DELIVERED_APP.init();
});
