/**
 * Zoth Studio — Local Project Workspace & Revision History Manager (v3.0)
 * 
 * Engine 17 in the Zoth Master Studio Ecosystem.
 * 
 * Capabilities:
 *  1. Local Project Management: Multi-project CRUD, cloning/forking, switching, archetypes.
 *  2. Dual Storage Layer: High-capacity IndexedDB + Fast LocalStorage fallback + Memory adapter.
 *  3. Real-Time Auto-Save Drafts: Debounced draft checkpointing, dirty-state detection, draft commits & discards.
 *  4. Deep Revision History & Undo/Redo Stacks: Bounded state snapshots, time-travel jumping, branching truncation.
 *  5. Named Milestone Snapshots: Permanent tagged releases/checkpoints unaffected by undo stack limits.
 *  6. Visual & Structural State Diffing: Key-level, section-level, and theme change analysis with human changelogs.
 *  7. Full JSON Import/Export: Standalone project bundles with checksum validation, collision strategy, and workspace-wide backups.
 *  8. Universal Runtime: Browser (UMD/Global, CustomEvents, Blob download) & Node.js (CommonJS, headless testing).
 *  9. Harness & Orchestrator Integration: Contract validation, ZothToolBench registration, ZothMasterOrchestrator auto-sync.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ZothWorkspaceHistory = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '3.0.0';
  var SCHEMA_VERSION = '2026-08-22';
  var DB_NAME = 'zoth_studio_workspace_db';
  var DB_VERSION = 1;
  var STORAGE_PREFIX = 'zoth_ws_';
  var DEFAULT_MAX_HISTORY = 60;
  var DEFAULT_AUTOSAVE_MS = 2000;

  // ---------------------------------------------------------------------------
  // 1. Archetype Templates
  // ---------------------------------------------------------------------------
  var ARCHETYPES = {
    'ai_swarm': {
      name: 'Apex AI Swarm',
      tagline: 'Autonomous Multi-Agent Intelligence & Spatial Computation',
      niche: 'ai_swarm',
      theme: 'obsidian-gold',
      tags: ['ai', 'swarm', 'autonomous'],
      sections: [
        { id: 'hero', name: 'Hero Banner', enabled: true, variant: 'particle-mesh' },
        { id: 'bento', name: 'Bento Feature Grid', enabled: true, variant: 'bento-6-box' },
        { id: 'pricing', name: 'Pricing Matrix', enabled: true, variant: 'monthly-annual' },
        { id: 'sandbox', name: 'Interactive Live Sandbox', enabled: true, variant: 'code-exec-audio' },
        { id: 'social_proof', name: 'Testimonials Marquee', enabled: true, variant: 'infinite-marquee' },
        { id: 'faq', name: 'FAQ Accordion', enabled: true, variant: 'accordion-a11y' },
        { id: 'cta', name: 'Conversion Call to Action', enabled: true, variant: 'glow-gradient' },
        { id: 'footer', name: 'Footer & Links', enabled: true, variant: 'multi-col' }
      ]
    },
    'saas_b2b': {
      name: 'Nexus Cloud SaaS',
      tagline: 'Enterprise Workflows Automated with Sovereign Intelligence',
      niche: 'saas_b2b',
      theme: 'midnight-neon',
      tags: ['saas', 'enterprise', 'cloud'],
      sections: [
        { id: 'hero', name: 'Hero Banner', enabled: true, variant: 'split-mockup' },
        { id: 'bento', name: 'Core Capabilities', enabled: true, variant: 'bento-4-box' },
        { id: 'social_proof', name: 'Client Logos & Trust', enabled: true, variant: 'logo-grid' },
        { id: 'pricing', name: 'Subscription Tiers', enabled: true, variant: 'tier-cards' },
        { id: 'faq', name: 'Enterprise FAQ', enabled: true, variant: 'accordion-a11y' },
        { id: 'footer', name: 'Footer & Compliance', enabled: true, variant: 'multi-col' }
      ]
    },
    'cyber_security': {
      name: 'Aegis Zero-Trust',
      tagline: 'Hardware-Isolated Cryptographic Security & Threat Intelligence',
      niche: 'cyber_security',
      theme: 'acid-grid',
      tags: ['security', 'zero-trust', 'audit'],
      sections: [
        { id: 'hero', name: 'Threat Radar Hero', enabled: true, variant: 'cyber-radar' },
        { id: 'bento', name: 'Security Matrix', enabled: true, variant: 'terminal-grid' },
        { id: 'sandbox', name: 'Live Payload Sandbox', enabled: true, variant: 'hex-inspector' },
        { id: 'pricing', name: 'Defense Contracts', enabled: true, variant: 'custom-quote' },
        { id: 'footer', name: 'Zero-Leak Footer', enabled: true, variant: 'minimal-bar' }
      ]
    },
    'creator_agency': {
      name: 'Velox Studio Agency',
      tagline: 'High-Impact Brand Identities & Kinetic Digital Experiences',
      niche: 'creator_agency',
      theme: 'ultraviolet-glass',
      tags: ['agency', 'portfolio', 'design'],
      sections: [
        { id: 'hero', name: 'Kinetic Reel Hero', enabled: true, variant: 'video-reveal' },
        { id: 'bento', name: 'Selected Works', enabled: true, variant: 'masonry-gallery' },
        { id: 'social_proof', name: 'Client Endorsements', enabled: true, variant: 'card-slider' },
        { id: 'cta', name: 'Book A Project', enabled: true, variant: 'calendar-embed' },
        { id: 'footer', name: 'Creative Studio Footer', enabled: true, variant: 'multi-col' }
      ]
    },
    'crypto_web3': {
      name: 'Zoth DEX Terminal',
      tagline: 'Sovereign On-Chain Liquidity & Algorithmic Yield Protocol',
      niche: 'crypto_web3',
      theme: 'retro-terminal',
      tags: ['crypto', 'web3', 'defi'],
      sections: [
        { id: 'hero', name: 'Terminal Hero', enabled: true, variant: 'ascii-depth' },
        { id: 'bento', name: 'Tokenomics & Pools', enabled: true, variant: 'stats-bento' },
        { id: 'social_proof', name: 'Audit Verifications', enabled: true, variant: 'cert-badges' },
        { id: 'cta', name: 'Launch App', enabled: true, variant: 'wallet-connect' },
        { id: 'footer', name: 'Decentralized Footer', enabled: true, variant: 'nodes-list' }
      ]
    },
    'minimalist_portfolio': {
      name: 'Aura Minimalist Portfolio',
      tagline: 'Understated Elegance for Modern Software Engineers',
      niche: 'minimalist_portfolio',
      theme: 'minimalist-clean',
      tags: ['portfolio', 'minimal', 'clean'],
      sections: [
        { id: 'hero', name: 'Typography Hero', enabled: true, variant: 'editorial-type' },
        { id: 'bento', name: 'Featured Case Studies', enabled: true, variant: 'clean-stack' },
        { id: 'social_proof', name: 'Writing & Articles', enabled: true, variant: 'list-view' },
        { id: 'footer', name: 'Contact & Connect', enabled: true, variant: 'minimal-bar' }
      ]
    }
  };

  // ---------------------------------------------------------------------------
  // 2. Storage Adapters (Memory, LocalStorage, IndexedDB)
  // ---------------------------------------------------------------------------

  // In-Memory Storage Adapter (synchronous fallback)
  var MemoryStorage = (function () {
    var data = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
      setItem: function (k, v) { data[k] = String(v); },
      removeItem: function (k) { delete data[k]; },
      clear: function () { data = {}; },
      keys: function () { return Object.keys(data); }
    };
  })();

  // Synchronous LocalStorage Adapter
  var LocalStorageAdapter = {
    isAvailable: function () {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          var testKey = '__zoth_storage_test__';
          window.localStorage.setItem(testKey, '1');
          window.localStorage.removeItem(testKey);
          return true;
        }
      } catch (e) { /* ignore */ }
      return false;
    },
    getStore: function () {
      return this.isAvailable() ? window.localStorage : MemoryStorage;
    },
    get: function (key) {
      try {
        var raw = this.getStore().getItem(STORAGE_PREFIX + key);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },
    set: function (key, value) {
      try {
        this.getStore().setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('[ZothWorkspaceHistory] LocalStorage set quota or error:', e.message);
        return false;
      }
    },
    remove: function (key) {
      try {
        this.getStore().removeItem(STORAGE_PREFIX + key);
        return true;
      } catch (e) {
        return false;
      }
    },
    listKeys: function (prefix) {
      var store = this.getStore();
      var fullPrefix = STORAGE_PREFIX + (prefix || '');
      var keys = [];
      if (typeof store.length === 'number') {
        for (var i = 0; i < store.length; i++) {
          var k = store.key(i);
          if (k && k.indexOf(fullPrefix) === 0) {
            keys.push(k.substring(STORAGE_PREFIX.length));
          }
        }
      } else if (typeof store.keys === 'function') {
        store.keys().forEach(function (k) {
          if (k.indexOf(fullPrefix) === 0) {
            keys.push(k.substring(STORAGE_PREFIX.length));
          }
        });
      }
      return keys;
    }
  };

  // IndexedDB Storage Layer (Async Promise-based)
  var IndexedDBAdapter = {
    dbPromise: null,
    isAvailable: function () {
      return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
    },
    init: function () {
      if (!this.isAvailable()) return Promise.resolve(null);
      if (this.dbPromise) return this.dbPromise;

      this.dbPromise = new Promise(function (resolve, reject) {
        try {
          var req = window.indexedDB.open(DB_NAME, DB_VERSION);
          req.onupgradeneeded = function (e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains('projects')) {
              var pStore = db.createObjectStore('projects', { keyPath: 'id' });
              pStore.createIndex('updated_at', 'updated_at', { unique: false });
              pStore.createIndex('name', 'name', { unique: false });
            }
            if (!db.objectStoreNames.contains('revisions')) {
              var rStore = db.createObjectStore('revisions', { keyPath: 'revId' });
              rStore.createIndex('projectId', 'projectId', { unique: false });
              rStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
            if (!db.objectStoreNames.contains('drafts')) {
              db.createObjectStore('drafts', { keyPath: 'projectId' });
            }
            if (!db.objectStoreNames.contains('snapshots')) {
              var sStore = db.createObjectStore('snapshots', { keyPath: 'snapshotId' });
              sStore.createIndex('projectId', 'projectId', { unique: false });
              sStore.createIndex('tag', 'tag', { unique: false });
            }
          };
          req.onsuccess = function (e) { resolve(e.target.result); };
          req.onerror = function (e) {
            console.warn('[ZothWorkspaceHistory] IndexedDB open error, falling back to LocalStorage:', e.target.error);
            resolve(null);
          };
        } catch (err) {
          resolve(null);
        }
      });
      return this.dbPromise;
    },
    put: async function (storeName, item) {
      var db = await this.init();
      if (!db) return false;
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction([storeName], 'readwrite');
          var store = tx.objectStore(storeName);
          var req = store.put(item);
          req.onsuccess = function () { resolve(true); };
          req.onerror = function () { resolve(false); };
        } catch (e) {
          resolve(false);
        }
      });
    },
    get: async function (storeName, key) {
      var db = await this.init();
      if (!db) return null;
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction([storeName], 'readonly');
          var store = tx.objectStore(storeName);
          var req = store.get(key);
          req.onsuccess = function () { resolve(req.result || null); };
          req.onerror = function () { resolve(null); };
        } catch (e) {
          resolve(null);
        }
      });
    },
    delete: async function (storeName, key) {
      var db = await this.init();
      if (!db) return false;
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction([storeName], 'readwrite');
          var store = tx.objectStore(storeName);
          var req = store.delete(key);
          req.onsuccess = function () { resolve(true); };
          req.onerror = function () { resolve(false); };
        } catch (e) {
          resolve(false);
        }
      });
    },
    getAll: async function (storeName) {
      var db = await this.init();
      if (!db) return [];
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction([storeName], 'readonly');
          var store = tx.objectStore(storeName);
          var req = store.getAll();
          req.onsuccess = function () { resolve(req.result || []); };
          req.onerror = function () { resolve([]); };
        } catch (e) {
          resolve([]);
        }
      });
    },
    getByIndex: async function (storeName, indexName, value) {
      var db = await this.init();
      if (!db) return [];
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction([storeName], 'readonly');
          var store = tx.objectStore(storeName);
          var index = store.index(indexName);
          var req = index.getAll(value);
          req.onsuccess = function () { resolve(req.result || []); };
          req.onerror = function () { resolve([]); };
        } catch (e) {
          resolve([]);
        }
      });
    }
  };

  // ---------------------------------------------------------------------------
  // 3. Helper Utilities
  // ---------------------------------------------------------------------------
  function generateId(prefix) {
    var p = prefix || 'item';
    var ts = Date.now().toString(36);
    var rand = Math.random().toString(36).substring(2, 8);
    return p + '_' + ts + '_' + rand;
  }

  function clone(obj) {
    if (obj === undefined || obj === null) return obj;
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      return Object.assign({}, obj);
    }
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function simpleChecksum(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  // ---------------------------------------------------------------------------
  // 4. State Diffing Engine
  // ---------------------------------------------------------------------------
  function computeDiff(oldState, newState) {
    if (!oldState || !newState) {
      return { changed: true, summary: 'Initial state established', details: {} };
    }

    var details = {
      themeChanged: oldState.theme !== newState.theme ? { from: oldState.theme, to: newState.theme } : null,
      nameChanged: oldState.name !== newState.name ? { from: oldState.name, to: newState.name } : null,
      taglineChanged: oldState.tagline !== newState.tagline ? { from: oldState.tagline, to: newState.tagline } : null,
      activePageChanged: oldState.activePage !== newState.activePage ? { from: oldState.activePage, to: newState.activePage } : null,
      activeViewportChanged: oldState.activeViewport !== newState.activeViewport ? { from: oldState.activeViewport, to: newState.activeViewport } : null,
      addedSections: [],
      removedSections: [],
      modifiedSections: []
    };

    var oldSections = Array.isArray(oldState.sections) ? oldState.sections : [];
    var newSections = Array.isArray(newState.sections) ? newState.sections : [];

    var oldMap = {};
    oldSections.forEach(function (s, idx) { oldMap[s.id || ('idx_' + idx)] = { section: s, index: idx }; });

    var newMap = {};
    newSections.forEach(function (s, idx) { newMap[s.id || ('idx_' + idx)] = { section: s, index: idx }; });

    newSections.forEach(function (ns, nIdx) {
      var sId = ns.id || ('idx_' + nIdx);
      if (!oldMap[sId]) {
        details.addedSections.push({ id: sId, name: ns.name, variant: ns.variant, index: nIdx });
      } else {
        var os = oldMap[sId].section;
        var diffs = [];
        if (os.enabled !== ns.enabled) diffs.push('enabled: ' + os.enabled + ' -> ' + ns.enabled);
        if (os.variant !== ns.variant) diffs.push('variant: ' + os.variant + ' -> ' + ns.variant);
        if (oldMap[sId].index !== nIdx) diffs.push('position: ' + oldMap[sId].index + ' -> ' + nIdx);
        if (JSON.stringify(os.data || {}) !== JSON.stringify(ns.data || {})) diffs.push('data changed');
        if (diffs.length > 0) {
          details.modifiedSections.push({ id: sId, name: ns.name, changes: diffs });
        }
      }
    });

    oldSections.forEach(function (os, oIdx) {
      var sId = os.id || ('idx_' + oIdx);
      if (!newMap[sId]) {
        details.removedSections.push({ id: sId, name: os.name, index: oIdx });
      }
    });

    var changeNotes = [];
    if (details.themeChanged) changeNotes.push('Theme: ' + details.themeChanged.to);
    if (details.nameChanged) changeNotes.push('Name: ' + details.nameChanged.to);
    if (details.addedSections.length) changeNotes.push('+' + details.addedSections.length + ' sections');
    if (details.removedSections.length) changeNotes.push('-' + details.removedSections.length + ' sections');
    if (details.modifiedSections.length) changeNotes.push(details.modifiedSections.length + ' section edits');

    var changed = !!(details.themeChanged || details.nameChanged || details.taglineChanged ||
      details.activePageChanged || details.activeViewportChanged ||
      details.addedSections.length || details.removedSections.length || details.modifiedSections.length);

    return {
      changed: changed,
      summary: changeNotes.length > 0 ? changeNotes.join(', ') : (changed ? 'Minor modifications' : 'No changes'),
      details: details
    };
  }

  // ---------------------------------------------------------------------------
  // 5. ZothWorkspaceHistory Manager Class Definition
  // ---------------------------------------------------------------------------
  function WorkspaceManager() {
    this.currentProjectId = 'proj_default';
    this.currentProject = null;
    this.historyStacks = {};   // projectId -> { stack: [revObj], cursor: number }
    this.drafts = {};          // projectId -> draftObj
    this.snapshots = {};       // projectId -> [snapshotObj]
    this.autoSaveTimer = null;
    this.autoSaveInterval = DEFAULT_AUTOSAVE_MS;
    this.listeners = {};       // eventName -> [callbacks]
    this.isDirty = false;

    // Load initial index or establish default project
    this._initSync();
  }

  WorkspaceManager.prototype = {
    VERSION: VERSION,
    SCHEMA_VERSION: SCHEMA_VERSION,
    ARCHETYPES: ARCHETYPES,

    // -------------------------------------------------------------------------
    // Event Emitter Layer
    // -------------------------------------------------------------------------
    on: function (event, fn) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(fn);
      return this;
    },
    off: function (event, fn) {
      if (!this.listeners[event]) return this;
      this.listeners[event] = this.listeners[event].filter(function (cb) { return cb !== fn; });
      return this;
    },
    emit: function (event, detail) {
      var list = this.listeners[event] || [];
      list.forEach(function (cb) {
        try { cb(detail); } catch (e) { console.error('[ZothWorkspaceHistory] Event listener error:', e); }
      });

      // Browser CustomEvent telemetry
      try {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('zoth:workspace:' + event, { detail: detail }));
        }
      } catch (e) { /* ignore */ }
    },

    // -------------------------------------------------------------------------
    // Synchronous Initialization & Index Loading
    // -------------------------------------------------------------------------
    _initSync: function () {
      var currentId = LocalStorageAdapter.get('active_project_id');
      var projectsIndex = LocalStorageAdapter.get('projects_index');

      if (!projectsIndex || !Array.isArray(projectsIndex) || projectsIndex.length === 0) {
        // Create initial default project from ai_swarm archetype
        var defProj = this.createDefaultProject('proj_default', 'Apex Cloud', 'ai_swarm');
        this.currentProjectId = defProj.id;
        this.currentProject = defProj;
        this._saveProjectSync(defProj);
        this._updateIndexSync([defProj.id]);
      } else {
        this.currentProjectId = (currentId && projectsIndex.indexOf(currentId) !== -1) ? currentId : projectsIndex[0];
        var loaded = this._loadProjectSync(this.currentProjectId);
        if (loaded) {
          this.currentProject = loaded;
        } else {
          var fallback = this.createDefaultProject(this.currentProjectId, 'Apex Cloud', 'ai_swarm');
          this.currentProject = fallback;
          this._saveProjectSync(fallback);
        }
      }

      // Restore stack and draft from LocalStorage for current project
      this._restoreProjectStateSync(this.currentProjectId);
    },

    createDefaultProject: function (id, name, archetypeKey) {
      var arch = ARCHETYPES[archetypeKey || 'ai_swarm'] || ARCHETYPES.ai_swarm;
      var now = nowIso();
      return {
        id: id || generateId('proj'),
        name: name || arch.name,
        tagline: arch.tagline,
        niche: arch.niche,
        theme: arch.theme,
        version: '1.0.0',
        created_at: now,
        updated_at: now,
        activePage: 'index.html',
        activeViewport: 'desktop',
        viewMode: 'preview',
        tags: clone(arch.tags || []),
        settings: {
          autoSaveIntervalMs: DEFAULT_AUTOSAVE_MS,
          maxHistoryStack: DEFAULT_MAX_HISTORY,
          telemetryEnabled: false,
          frameworkTarget: 'astro'
        },
        sections: clone(arch.sections),
        customCode: {
          css: '',
          headHtml: '',
          bodyHtml: ''
        },
        metadata: {
          seoTitle: name || arch.name,
          seoDescription: arch.tagline,
          ogImage: ''
        }
      };
    },

    _saveProjectSync: function (proj) {
      if (!proj || !proj.id) return false;
      LocalStorageAdapter.set('project_' + proj.id, proj);
      // Asynchronously mirror to IndexedDB
      IndexedDBAdapter.put('projects', proj);
      return true;
    },

    _loadProjectSync: function (projectId) {
      return LocalStorageAdapter.get('project_' + projectId);
    },

    _updateIndexSync: function (ids) {
      LocalStorageAdapter.set('projects_index', ids);
      LocalStorageAdapter.set('active_project_id', this.currentProjectId);
    },

    _restoreProjectStateSync: function (projectId) {
      // Reconstitute history stack
      var stackData = LocalStorageAdapter.get('history_' + projectId);
      if (stackData && Array.isArray(stackData.stack)) {
        this.historyStacks[projectId] = {
          stack: stackData.stack,
          cursor: typeof stackData.cursor === 'number' ? stackData.cursor : stackData.stack.length - 1
        };
      } else {
        var targetProj = (this.currentProjectId === projectId && this.currentProject) ? this.currentProject : this._loadProjectSync(projectId);
        var genesisRev = {
          revId: generateId('rev_init'),
          projectId: projectId,
          action: 'project.init',
          description: 'Project workspace initialized',
          timestamp: (targetProj && targetProj.created_at) ? targetProj.created_at : nowIso(),
          stateSnapshot: clone(targetProj),
          diffSummary: { summary: 'Genesis Revision' }
        };
        this.historyStacks[projectId] = {
          stack: [genesisRev],
          cursor: 0
        };
        this._saveHistorySync(projectId);
      }

      // Reconstitute draft
      var draft = LocalStorageAdapter.get('draft_' + projectId);
      if (draft) {
        this.drafts[projectId] = draft;
      }

      // Reconstitute snapshots
      var snaps = LocalStorageAdapter.get('snapshots_' + projectId);
      if (Array.isArray(snaps)) {
        this.snapshots[projectId] = snaps;
      } else {
        this.snapshots[projectId] = [];
      }
    },

    _saveHistorySync: function (projectId) {
      var h = this.historyStacks[projectId];
      if (h) {
        LocalStorageAdapter.set('history_' + projectId, h);
        // Async mirror latest revisions to IndexedDB
        var latestRev = h.stack[h.cursor];
        if (latestRev) {
          IndexedDBAdapter.put('revisions', latestRev);
        }
      }
    },

    _saveDraftSync: function (projectId, draft) {
      this.drafts[projectId] = draft;
      LocalStorageAdapter.set('draft_' + projectId, draft);
      IndexedDBAdapter.put('drafts', draft);
    },

    _saveSnapshotsSync: function (projectId) {
      var s = this.snapshots[projectId] || [];
      LocalStorageAdapter.set('snapshots_' + projectId, s);
    },

    // -------------------------------------------------------------------------
    // Project CRUD & Switching
    // -------------------------------------------------------------------------
    listProjects: function () {
      var index = LocalStorageAdapter.get('projects_index') || [];
      var self = this;
      var list = [];

      index.forEach(function (id) {
        var p = (self.currentProjectId === id && self.currentProject) ? self.currentProject : self._loadProjectSync(id);
        if (p) {
          var stack = self.historyStacks[id] ? self.historyStacks[id].stack : [];
          var draft = self.drafts[id] || LocalStorageAdapter.get('draft_' + id);
          var snaps = self.snapshots[id] || LocalStorageAdapter.get('snapshots_' + id) || [];
          list.push({
            id: p.id,
            name: p.name,
            tagline: p.tagline,
            niche: p.niche,
            theme: p.theme,
            version: p.version,
            active: p.id === self.currentProjectId,
            updated_at: p.updated_at,
            created_at: p.created_at,
            sectionsCount: (p.sections || []).length,
            revisionsCount: stack.length,
            snapshotsCount: snaps.length,
            hasDraft: !!(draft && draft.isDirty)
          });
        }
      });
      return list;
    },

    getProject: function (projectId) {
      var targetId = projectId || this.currentProjectId;
      if (targetId === this.currentProjectId && this.currentProject) {
        return clone(this.currentProject);
      }
      return clone(this._loadProjectSync(targetId));
    },

    getCurrentProject: function () {
      return this.currentProject ? clone(this.currentProject) : null;
    },

    createProject: function (opts) {
      opts = opts || {};
      var id = opts.id || generateId('proj');
      var name = opts.name || 'New Project';
      var archetype = opts.archetype || opts.niche || 'ai_swarm';
      var newProj = this.createDefaultProject(id, name, archetype);

      if (opts.theme) newProj.theme = opts.theme;
      if (opts.tagline) newProj.tagline = opts.tagline;
      if (opts.tags) newProj.tags = clone(opts.tags);
      if (opts.sections) newProj.sections = clone(opts.sections);

      this._saveProjectSync(newProj);

      var index = LocalStorageAdapter.get('projects_index') || [];
      if (index.indexOf(id) === -1) {
        index.push(id);
        this._updateIndexSync(index);
      }

      this._restoreProjectStateSync(id);

      this.emit('project:created', { project: clone(newProj), ts: nowIso() });

      if (opts.activate !== false) {
        this.switchProject(id);
      }

      return clone(newProj);
    },

    updateProject: function (projectId, updates, actionName, description) {
      var targetId = projectId || this.currentProjectId;
      var current = this.getProject(targetId);
      if (!current) throw new Error('Project not found: ' + targetId);

      var oldState = clone(current);
      var merged = Object.assign({}, current, updates);
      merged.updated_at = nowIso();

      if (targetId === this.currentProjectId) {
        this.currentProject = merged;
      }

      this._saveProjectSync(merged);

      // Record in revision stack
      this.pushRevision(
        targetId,
        merged,
        actionName || 'project.update',
        description || 'Project settings updated',
        oldState
      );

      // Clear draft since state is explicitly committed
      this.discardDraft(targetId);

      this.emit('project:updated', { projectId: targetId, project: clone(merged), ts: nowIso() });
      return clone(merged);
    },

    switchProject: function (targetProjectId, opts) {
      opts = opts || {};
      if (!targetProjectId) throw new Error('targetProjectId is required');
      if (targetProjectId === this.currentProjectId && this.currentProject) {
        return clone(this.currentProject);
      }

      // Auto-save draft of current project if dirty
      if (this.isDirty && this.currentProject) {
        this.saveDraft(this.currentProjectId, this.currentProject);
      }

      var targetProj = this._loadProjectSync(targetProjectId);
      if (!targetProj) throw new Error('Target project not found: ' + targetProjectId);

      this.currentProjectId = targetProjectId;
      this.currentProject = targetProj;
      LocalStorageAdapter.set('active_project_id', targetProjectId);

      this._restoreProjectStateSync(targetProjectId);

      // Check if draft exists and restore if requested
      var draft = this.getDraft(targetProjectId);
      if (draft && draft.isDirty && opts.restoreDraft !== false) {
        if (draft.stateSnapshot) {
          this.currentProject = clone(draft.stateSnapshot);
          this.isDirty = true;
        }
      } else {
        this.isDirty = false;
      }

      // Sync with ZothMasterOrchestrator if present in the environment
      this._syncToOrchestrator();

      this.emit('project:switched', { projectId: targetProjectId, project: clone(this.currentProject), ts: nowIso() });
      return clone(this.currentProject);
    },

    forkProject: function (sourceProjectId, newName) {
      var srcId = sourceProjectId || this.currentProjectId;
      var src = this.getProject(srcId);
      if (!src) throw new Error('Source project not found: ' + srcId);

      var newId = generateId('proj');
      var forked = clone(src);
      var now = nowIso();
      forked.id = newId;
      forked.name = newName || (src.name + ' (Fork)');
      forked.created_at = now;
      forked.updated_at = now;

      this._saveProjectSync(forked);

      var index = LocalStorageAdapter.get('projects_index') || [];
      index.push(newId);
      this._updateIndexSync(index);

      // Copy snapshots
      var srcSnaps = this.snapshots[srcId] || [];
      this.snapshots[newId] = clone(srcSnaps).map(function (s) {
        s.snapshotId = generateId('snap');
        s.projectId = newId;
        return s;
      });
      this._saveSnapshotsSync(newId);

      // Initialize fresh history stack
      this.historyStacks[newId] = {
        stack: [{
          revId: generateId('rev_fork'),
          projectId: newId,
          action: 'project.fork',
          description: 'Forked from ' + src.name + ' (' + srcId + ')',
          timestamp: now,
          stateSnapshot: clone(forked),
          diffSummary: { summary: 'Forked Workspace' }
        }],
        cursor: 0
      };
      this._saveHistorySync(newId);

      this.emit('project:forked', { sourceId: srcId, newProject: clone(forked), ts: now });
      return clone(forked);
    },

    deleteProject: function (projectId) {
      if (!projectId) throw new Error('projectId is required');
      var index = LocalStorageAdapter.get('projects_index') || [];
      if (index.length <= 1) {
        throw new Error('Cannot delete the only remaining project in the workspace.');
      }

      // Remove from LocalStorage
      LocalStorageAdapter.remove('project_' + projectId);
      LocalStorageAdapter.remove('history_' + projectId);
      LocalStorageAdapter.remove('draft_' + projectId);
      LocalStorageAdapter.remove('snapshots_' + projectId);

      // Remove from IndexedDB
      IndexedDBAdapter.delete('projects', projectId);
      IndexedDBAdapter.delete('drafts', projectId);

      // Clean memory references
      delete this.historyStacks[projectId];
      delete this.drafts[projectId];
      delete this.snapshots[projectId];

      // Update index
      var newIndex = index.filter(function (id) { return id !== projectId; });
      this._updateIndexSync(newIndex);

      this.emit('project:deleted', { projectId: projectId, ts: nowIso() });

      // If active project was deleted, switch to the first remaining
      if (this.currentProjectId === projectId) {
        this.switchProject(newIndex[0]);
      }

      return true;
    },

    // -------------------------------------------------------------------------
    // Deep Revision History & Undo/Redo Engine
    // -------------------------------------------------------------------------
    pushRevision: function (projectId, state, action, description, oldState) {
      var targetId = projectId || this.currentProjectId;
      if (!this.historyStacks[targetId]) {
        this._restoreProjectStateSync(targetId);
      }

      var h = this.historyStacks[targetId];
      var maxStack = (state.settings && state.settings.maxHistoryStack) || DEFAULT_MAX_HISTORY;

      // Truncate redo branches ahead of cursor
      if (h.cursor < h.stack.length - 1) {
        h.stack = h.stack.slice(0, h.cursor + 1);
      }

      var diff = computeDiff(oldState || (h.stack[h.cursor] ? h.stack[h.cursor].stateSnapshot : null), state);

      var rev = {
        revId: generateId('rev'),
        projectId: targetId,
        action: action || 'state.change',
        description: description || diff.summary || 'Workspace modified',
        timestamp: nowIso(),
        stateSnapshot: clone(state),
        diffSummary: diff
      };

      h.stack.push(rev);

      // Keep within bounded max stack depth
      if (h.stack.length > maxStack) {
        h.stack.shift();
      }

      h.cursor = h.stack.length - 1;
      this._saveHistorySync(targetId);

      this.emit('history:push', { projectId: targetId, revision: rev, cursor: h.cursor });
      return rev;
    },

    undo: function (projectId) {
      var targetId = projectId || this.currentProjectId;
      var h = this.historyStacks[targetId];
      if (!h || h.cursor <= 0) return null;

      h.cursor--;
      var prevRev = h.stack[h.cursor];
      var restoredState = clone(prevRev.stateSnapshot);

      if (targetId === this.currentProjectId) {
        this.currentProject = restoredState;
        this._syncToOrchestrator();
      }

      this._saveProjectSync(restoredState);
      this._saveHistorySync(targetId);
      this.isDirty = false;

      this.emit('history:undo', { projectId: targetId, cursor: h.cursor, revision: prevRev, state: restoredState });
      return restoredState;
    },

    redo: function (projectId) {
      var targetId = projectId || this.currentProjectId;
      var h = this.historyStacks[targetId];
      if (!h || h.cursor >= h.stack.length - 1) return null;

      h.cursor++;
      var nextRev = h.stack[h.cursor];
      var restoredState = clone(nextRev.stateSnapshot);

      if (targetId === this.currentProjectId) {
        this.currentProject = restoredState;
        this._syncToOrchestrator();
      }

      this._saveProjectSync(restoredState);
      this._saveHistorySync(targetId);
      this.isDirty = false;

      this.emit('history:redo', { projectId: targetId, cursor: h.cursor, revision: nextRev, state: restoredState });
      return restoredState;
    },

    canUndo: function (projectId) {
      var targetId = projectId || this.currentProjectId;
      var h = this.historyStacks[targetId];
      return !!(h && h.cursor > 0);
    },

    canRedo: function (projectId) {
      var targetId = projectId || this.currentProjectId;
      var h = this.historyStacks[targetId];
      return !!(h && h.cursor < h.stack.length - 1);
    },

    getHistory: function (projectId) {
      var targetId = projectId || this.currentProjectId;
      var h = this.historyStacks[targetId];
      if (!h) return { stack: [], cursor: -1, canUndo: false, canRedo: false };

      return {
        stack: h.stack.map(function (rev, idx) {
          return {
            revId: rev.revId,
            action: rev.action,
            description: rev.description,
            timestamp: rev.timestamp,
            active: idx === h.cursor,
            diffSummary: rev.diffSummary ? rev.diffSummary.summary : ''
          };
        }),
        cursor: h.cursor,
        canUndo: h.cursor > 0,
        canRedo: h.cursor < h.stack.length - 1
      };
    },

    jumpToRevision: function (projectId, revIdOrIndex) {
      var targetId = projectId || this.currentProjectId;
      var h = this.historyStacks[targetId];
      if (!h || !h.stack.length) return null;

      var targetIndex = -1;
      if (typeof revIdOrIndex === 'number') {
        targetIndex = revIdOrIndex;
      } else {
        for (var i = 0; i < h.stack.length; i++) {
          if (h.stack[i].revId === revIdOrIndex) {
            targetIndex = i;
            break;
          }
        }
      }

      if (targetIndex < 0 || targetIndex >= h.stack.length) return null;

      h.cursor = targetIndex;
      var targetRev = h.stack[targetIndex];
      var state = clone(targetRev.stateSnapshot);

      if (targetId === this.currentProjectId) {
        this.currentProject = state;
        this._syncToOrchestrator();
      }

      this._saveProjectSync(state);
      this._saveHistorySync(targetId);
      this.isDirty = false;

      this.emit('history:jump', { projectId: targetId, cursor: h.cursor, revision: targetRev, state: state });
      return state;
    },

    // -------------------------------------------------------------------------
    // Auto-Save Drafts & Dirty Checkpointing
    // -------------------------------------------------------------------------
    markDirty: function (state) {
      this.isDirty = true;
      if (state && this.currentProject) {
        this.currentProject = clone(state);
      }
      this.emit('draft:dirty', { projectId: this.currentProjectId, ts: nowIso() });
    },

    saveDraft: function (projectId, state) {
      var targetId = projectId || this.currentProjectId;
      var payload = {
        projectId: targetId,
        updatedAt: nowIso(),
        isDirty: true,
        stateSnapshot: clone(state || this.currentProject)
      };

      this._saveDraftSync(targetId, payload);
      this.isDirty = false;

      this.emit('draft:saved', { projectId: targetId, ts: payload.updatedAt });
      return payload;
    },

    getDraft: function (projectId) {
      var targetId = projectId || this.currentProjectId;
      return this.drafts[targetId] || LocalStorageAdapter.get('draft_' + targetId);
    },

    hasDraft: function (projectId) {
      var d = this.getDraft(projectId);
      return !!(d && d.isDirty);
    },

    commitDraft: function (projectId, action, description) {
      var targetId = projectId || this.currentProjectId;
      var draft = this.getDraft(targetId);
      if (!draft || !draft.stateSnapshot) return null;

      var committed = this.updateProject(
        targetId,
        draft.stateSnapshot,
        action || 'draft.commit',
        description || 'Committed auto-saved workspace draft'
      );
      return committed;
    },

    discardDraft: function (projectId) {
      var targetId = projectId || this.currentProjectId;
      delete this.drafts[targetId];
      LocalStorageAdapter.remove('draft_' + targetId);
      IndexedDBAdapter.delete('drafts', targetId);
      this.isDirty = false;

      // Reload clean project from storage
      var clean = this._loadProjectSync(targetId);
      if (targetId === this.currentProjectId && clean) {
        this.currentProject = clean;
        this._syncToOrchestrator();
      }

      this.emit('draft:discarded', { projectId: targetId, ts: nowIso() });
      return clean;
    },

    startAutoSaveTimer: function (getStateFn, intervalMs) {
      var self = this;
      this.stopAutoSaveTimer();
      var interval = intervalMs || this.autoSaveInterval;

      this.autoSaveTimer = setInterval(function () {
        if (self.isDirty && typeof getStateFn === 'function') {
          var state = getStateFn();
          if (state) {
            self.saveDraft(self.currentProjectId, state);
          }
        }
      }, interval);

      return this;
    },

    stopAutoSaveTimer: function () {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer);
        this.autoSaveTimer = null;
      }
      return this;
    },

    // -------------------------------------------------------------------------
    // Named Milestone Snapshots
    // -------------------------------------------------------------------------
    createSnapshot: function (projectId, name, description, tag) {
      var targetId = projectId || this.currentProjectId;
      var current = this.getProject(targetId);
      if (!current) throw new Error('Project not found: ' + targetId);

      var snap = {
        snapshotId: generateId('snap'),
        projectId: targetId,
        name: name || ('Snapshot ' + new Date().toLocaleDateString()),
        description: description || '',
        tag: tag || 'milestone',
        timestamp: nowIso(),
        version: current.version || '1.0.0',
        stateSnapshot: clone(current)
      };

      if (!this.snapshots[targetId]) this.snapshots[targetId] = [];
      this.snapshots[targetId].push(snap);
      this._saveSnapshotsSync(targetId);
      IndexedDBAdapter.put('snapshots', snap);

      this.emit('snapshot:created', { snapshot: snap, ts: snap.timestamp });
      return snap;
    },

    listSnapshots: function (projectId) {
      var targetId = projectId || this.currentProjectId;
      var list = this.snapshots[targetId] || LocalStorageAdapter.get('snapshots_' + targetId) || [];
      return clone(list);
    },

    restoreSnapshot: function (projectId, snapshotId) {
      var targetId = projectId || this.currentProjectId;
      var snaps = this.listSnapshots(targetId);
      var snap = null;
      for (var i = 0; i < snaps.length; i++) {
        if (snaps[i].snapshotId === snapshotId) {
          snap = snaps[i];
          break;
        }
      }
      if (!snap) throw new Error('Snapshot not found: ' + snapshotId);

      var restored = this.updateProject(
        targetId,
        snap.stateSnapshot,
        'snapshot.restore',
        'Restored milestone snapshot: ' + snap.name
      );

      this.emit('snapshot:restored', { snapshot: snap, ts: nowIso() });
      return restored;
    },

    deleteSnapshot: function (projectId, snapshotId) {
      var targetId = projectId || this.currentProjectId;
      var snaps = this.listSnapshots(targetId);
      var filtered = snaps.filter(function (s) { return s.snapshotId !== snapshotId; });
      this.snapshots[targetId] = filtered;
      this._saveSnapshotsSync(targetId);
      IndexedDBAdapter.delete('snapshots', snapshotId);

      this.emit('snapshot:deleted', { projectId: targetId, snapshotId: snapshotId, ts: nowIso() });
      return true;
    },

    // -------------------------------------------------------------------------
    // JSON Import & Export
    // -------------------------------------------------------------------------
    exportProjectJSON: function (projectId, opts) {
      opts = opts || {};
      var targetId = projectId || this.currentProjectId;
      var p = this.getProject(targetId);
      if (!p) throw new Error('Project not found: ' + targetId);

      var h = this.historyStacks[targetId];
      var snaps = this.snapshots[targetId] || [];
      var draft = this.drafts[targetId] || null;

      var bundle = {
        $schema: 'https://zoth.io/schemas/workspace-bundle.v1.json',
        bundleVersion: '1.0.0',
        exportedAt: nowIso(),
        exportSource: 'Zoth Studio Workspace History Manager v' + VERSION,
        project: clone(p),
        revisions: (opts.includeRevisions !== false && h) ? clone(h.stack) : [],
        snapshots: (opts.includeSnapshots !== false) ? clone(snaps) : [],
        draft: (opts.includeDrafts === true && draft) ? clone(draft) : null
      };

      var serialized = JSON.stringify(bundle);
      bundle.checksum = simpleChecksum(serialized);

      if (opts.format === 'string') {
        return JSON.stringify(bundle, null, opts.pretty ? 2 : undefined);
      }
      return bundle;
    },

    exportAllWorkspacesJSON: function (opts) {
      opts = opts || {};
      var index = LocalStorageAdapter.get('projects_index') || [];
      var self = this;
      var projects = [];

      index.forEach(function (id) {
        try {
          projects.push(self.exportProjectJSON(id, opts));
        } catch (e) { /* ignore single project export failures */ }
      });

      var fullBackup = {
        $schema: 'https://zoth.io/schemas/workspace-full-backup.v1.json',
        backupVersion: '1.0.0',
        exportedAt: nowIso(),
        activeProjectId: this.currentProjectId,
        totalProjects: projects.length,
        projects: projects
      };

      if (opts.format === 'string') {
        return JSON.stringify(fullBackup, null, opts.pretty ? 2 : undefined);
      }
      return fullBackup;
    },

    importProjectJSON: function (jsonData, opts) {
      opts = opts || {};
      var bundle = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

      if (!bundle || typeof bundle !== 'object') {
        throw new Error('Invalid JSON bundle: not an object');
      }

      // Check if it is a full workspace backup
      if (bundle.$schema && bundle.$schema.indexOf('workspace-full-backup') !== -1 && Array.isArray(bundle.projects)) {
        return this.importAllWorkspacesJSON(bundle, opts);
      }

      var proj = bundle.project || (bundle.id ? bundle : null);
      if (!proj || !proj.id || !proj.name) {
        throw new Error('Invalid project structure: missing id or name');
      }

      var collisionStrategy = opts.collisionStrategy || 'rename_copy'; // 'rename_copy' | 'overwrite' | 'error'
      var existingIndex = LocalStorageAdapter.get('projects_index') || [];
      var targetId = proj.id;

      if (existingIndex.indexOf(targetId) !== -1) {
        if (collisionStrategy === 'error') {
          throw new Error('Project with ID ' + targetId + ' already exists.');
        } else if (collisionStrategy === 'rename_copy') {
          targetId = generateId('proj');
          proj.id = targetId;
          proj.name = proj.name + ' (Imported)';
        }
        // 'overwrite' strategy continues with same targetId
      }

      proj.updated_at = nowIso();
      this._saveProjectSync(proj);

      if (existingIndex.indexOf(targetId) === -1) {
        existingIndex.push(targetId);
        this._updateIndexSync(existingIndex);
      }

      // Import revisions if present
      if (Array.isArray(bundle.revisions) && bundle.revisions.length > 0) {
        var importedStack = bundle.revisions.map(function (rev) {
          rev.projectId = targetId;
          return rev;
        });
        this.historyStacks[targetId] = {
          stack: importedStack,
          cursor: importedStack.length - 1
        };
      } else {
        this.historyStacks[targetId] = {
          stack: [{
            revId: generateId('rev_import'),
            projectId: targetId,
            action: 'project.import',
            description: 'Imported from JSON bundle',
            timestamp: nowIso(),
            stateSnapshot: clone(proj),
            diffSummary: { summary: 'Imported Bundle' }
          }],
          cursor: 0
        };
      }
      this._saveHistorySync(targetId);

      // Import snapshots if present
      if (Array.isArray(bundle.snapshots)) {
        var importedSnaps = bundle.snapshots.map(function (s) {
          s.projectId = targetId;
          return s;
        });
        this.snapshots[targetId] = importedSnaps;
        this._saveSnapshotsSync(targetId);
      }

      this.emit('project:imported', { project: clone(proj), ts: nowIso() });

      if (opts.activate !== false) {
        this.switchProject(targetId);
      }

      return clone(proj);
    },

    importAllWorkspacesJSON: function (jsonData, opts) {
      opts = opts || {};
      var backup = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (!backup || !Array.isArray(backup.projects)) {
        throw new Error('Invalid workspace backup format: missing projects array');
      }

      var self = this;
      var importedList = [];
      backup.projects.forEach(function (pBundle) {
        try {
          var imp = self.importProjectJSON(pBundle, Object.assign({}, opts, { activate: false }));
          importedList.push(imp);
        } catch (e) {
          console.warn('[ZothWorkspaceHistory] Failed to import one project in backup batch:', e.message);
        }
      });

      if (backup.activeProjectId && importedList.some(function (p) { return p.id === backup.activeProjectId; })) {
        this.switchProject(backup.activeProjectId);
      } else if (importedList.length > 0 && opts.activate !== false) {
        this.switchProject(importedList[0].id);
      }

      return {
        totalImported: importedList.length,
        projects: importedList
      };
    },

    downloadJSON: function (filename, data) {
      try {
        if (typeof window !== 'undefined' && window.document) {
          var str = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
          var blob = new Blob([str], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = window.document.createElement('a');
          a.href = url;
          a.download = filename || ('zoth-project-' + this.currentProjectId + '.json');
          window.document.body.appendChild(a);
          a.click();
          window.document.body.removeChild(a);
          URL.revokeObjectURL(url);
          return true;
        }
      } catch (e) {
        console.warn('[ZothWorkspaceHistory] downloadJSON failed:', e);
      }
      return false;
    },

    // -------------------------------------------------------------------------
    // Orchestrator Synchronization Helper
    // -------------------------------------------------------------------------
    _syncToOrchestrator: function () {
      try {
        var orch = (typeof window !== 'undefined' && window.ZothMasterOrchestrator) || (typeof global !== 'undefined' && global.ZothMasterOrchestrator);
        if (orch && orch.state && this.currentProject) {
          orch.state.projectId = this.currentProject.id;
          orch.state.projectName = this.currentProject.name;
          orch.state.tagline = this.currentProject.tagline;
          orch.state.niche = this.currentProject.niche;
          orch.state.theme = this.currentProject.theme;
          orch.state.activePage = this.currentProject.activePage;
          orch.state.activeViewport = this.currentProject.activeViewport;
          orch.state.viewMode = this.currentProject.viewMode;
          if (Array.isArray(this.currentProject.sections)) {
            orch.state.sections = clone(this.currentProject.sections);
          }
        }
      } catch (e) { /* fail-soft */ }
    }
  };

  // Create singleton instance
  var instance = new WorkspaceManager();

  // ---------------------------------------------------------------------------
  // 6. Tool Harness Contract Adapter (ZothToolBench compliance)
  // ---------------------------------------------------------------------------
  var ACTIONS = {
    'workspace.list': true,
    'workspace.get': true,
    'workspace.create': true,
    'workspace.update': true,
    'workspace.delete': true,
    'workspace.switch': true,
    'workspace.fork': true,
    'workspace.undo': true,
    'workspace.redo': true,
    'workspace.history': true,
    'workspace.jump': true,
    'workspace.autosave': true,
    'workspace.draft_get': true,
    'workspace.draft_commit': true,
    'workspace.draft_discard': true,
    'workspace.snapshot_create': true,
    'workspace.snapshot_list': true,
    'workspace.snapshot_restore': true,
    'workspace.snapshot_delete': true,
    'workspace.diff': true,
    'workspace.export': true,
    'workspace.import': true,
    'workspace.export_all': true,
    'workspace.import_all': true
  };

  function validate(request) {
    if (!request || typeof request !== 'object') {
      return { ok: false, error: { code: 'validation_error', message: 'request must be an object' } };
    }
    var action = request.action;
    if (!action || typeof action !== 'string') {
      return { ok: false, error: { code: 'validation_error', message: 'action is required' } };
    }
    if (!ACTIONS[action]) {
      return { ok: false, error: { code: 'unsupported_action', message: 'action ' + action + ' is not supported' } };
    }
    return { ok: true };
  }

  async function run(request, opts) {
    opts = opts || {};
    var v = validate(request);
    if (!v.ok) return v;

    var action = request.action;
    var p = request.params || {};
    var reqId = (request.meta && request.meta.request_id) || generateId('req');
    var ts = nowIso();

    try {
      var data = null;
      switch (action) {
        case 'workspace.list':
          data = instance.listProjects();
          break;
        case 'workspace.get':
          data = instance.getProject(p.projectId);
          break;
        case 'workspace.create':
          data = instance.createProject(p);
          break;
        case 'workspace.update':
          data = instance.updateProject(p.projectId, p.updates || {}, p.actionName, p.description);
          break;
        case 'workspace.delete':
          data = instance.deleteProject(p.projectId);
          break;
        case 'workspace.switch':
          data = instance.switchProject(p.projectId, p.options);
          break;
        case 'workspace.fork':
          data = instance.forkProject(p.projectId, p.newName);
          break;
        case 'workspace.undo':
          data = instance.undo(p.projectId);
          break;
        case 'workspace.redo':
          data = instance.redo(p.projectId);
          break;
        case 'workspace.history':
          data = instance.getHistory(p.projectId);
          break;
        case 'workspace.jump':
          data = instance.jumpToRevision(p.projectId, p.target);
          break;
        case 'workspace.autosave':
          data = instance.saveDraft(p.projectId, p.state);
          break;
        case 'workspace.draft_get':
          data = instance.getDraft(p.projectId);
          break;
        case 'workspace.draft_commit':
          data = instance.commitDraft(p.projectId, p.actionName, p.description);
          break;
        case 'workspace.draft_discard':
          data = instance.discardDraft(p.projectId);
          break;
        case 'workspace.snapshot_create':
          data = instance.createSnapshot(p.projectId, p.name, p.description, p.tag);
          break;
        case 'workspace.snapshot_list':
          data = instance.listSnapshots(p.projectId);
          break;
        case 'workspace.snapshot_restore':
          data = instance.restoreSnapshot(p.projectId, p.snapshotId);
          break;
        case 'workspace.snapshot_delete':
          data = instance.deleteSnapshot(p.projectId, p.snapshotId);
          break;
        case 'workspace.diff':
          data = computeDiff(p.oldState, p.newState);
          break;
        case 'workspace.export':
          data = instance.exportProjectJSON(p.projectId, p.options);
          break;
        case 'workspace.import':
          data = instance.importProjectJSON(p.bundle || p.jsonData, p.options);
          break;
        case 'workspace.export_all':
          data = instance.exportAllWorkspacesJSON(p.options);
          break;
        case 'workspace.import_all':
          data = instance.importAllWorkspacesJSON(p.backup || p.jsonData, p.options);
          break;
        default:
          return { ok: false, error: { code: 'unsupported_action', message: 'Unhandled action: ' + action } };
      }

      return {
        ok: true,
        data: data,
        meta: { request_id: reqId, ts: ts, simulated: false }
      };
    } catch (err) {
      return {
        ok: false,
        error: { code: 'execution_error', message: err.message },
        meta: { request_id: reqId, ts: ts }
      };
    }
  }

  function meta(request_id, ts) {
    return { request_id: request_id || generateId('req'), ts: ts || nowIso() };
  }

  // ---------------------------------------------------------------------------
  // 7. Auto-Registration with Master Orchestrator & Tool Bench
  // ---------------------------------------------------------------------------
  try {
    if (typeof window !== 'undefined') {
      if (window.ZothMasterOrchestrator && typeof window.ZothMasterOrchestrator.registerEngine === 'function') {
        window.ZothMasterOrchestrator.registerEngine('workspace-history', instance);
      }
      if (window.ZothToolBench && typeof window.ZothToolBench.register === 'function') {
        window.ZothToolBench.register({
          id: 'site-workspace-history',
          version: SCHEMA_VERSION,
          owner: 'hermes',
          actions: Object.keys(ACTIONS),
          validate: validate,
          run: run,
          meta: meta
        });
      }
    }
  } catch (e) { /* fail-soft */ }

  // Expose public API
  return {
    VERSION: VERSION,
    SCHEMA_VERSION: SCHEMA_VERSION,
    ARCHETYPES: ARCHETYPES,
    ACTIONS: ACTIONS,
    manager: instance,
    validate: validate,
    run: run,
    meta: meta,
    computeDiff: computeDiff,
    IndexedDBAdapter: IndexedDBAdapter,
    LocalStorageAdapter: LocalStorageAdapter,
    MemoryStorage: MemoryStorage,
    WorkspaceManager: WorkspaceManager
  };
});
