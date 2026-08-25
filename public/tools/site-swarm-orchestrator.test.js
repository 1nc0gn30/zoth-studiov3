const test = require('node:test');
const assert = require('node:assert');
const ZothSwarmOrchestrator = require('./site-swarm-orchestrator.js');

test('ZothSwarmOrchestrator has version 4.2.0 and 21 agents', () => {
  assert.strictEqual(ZothSwarmOrchestrator.VERSION, '4.2.0');
  const agents = ZothSwarmOrchestrator.getAllAgents();
  assert.strictEqual(agents.length, 21);
});

test('All 21 agents have valid attributes and unique IDs', () => {
  const agents = ZothSwarmOrchestrator.getAllAgents();
  const seenIds = new Set();

  agents.forEach((agent, index) => {
    assert.strictEqual(agent.num, index + 1);
    assert.ok(agent.id && typeof agent.id === 'string');
    assert.ok(agent.name && typeof agent.name === 'string');
    assert.ok(agent.icon && typeof agent.icon === 'string');
    assert.ok(agent.role && typeof agent.role === 'string');
    assert.ok(agent.task && typeof agent.task === 'string');
    assert.ok(!seenIds.has(agent.id), `Duplicate agent ID: ${agent.id}`);
    seenIds.add(agent.id);
  });
});

test('getAgent retrieves agents by id or number', () => {
  const agent1 = ZothSwarmOrchestrator.getAgent(1);
  assert.strictEqual(agent1.id, 'agent_copywriter');
  assert.strictEqual(agent1.name, 'Domain Copywriter');

  const agent21 = ZothSwarmOrchestrator.getAgent('agent_netlify_ax_healer');
  assert.strictEqual(agent21.num, 21);
  assert.strictEqual(agent21.name, 'Netlify AX Self-Healing Lead');
});

test('detectArchetype correctly classifies all 8 domains', () => {
  const testCases = [
    { site: { name: 'Precision Cuts Lawn Care', templateId: 'lawn-care', prompt: 'Lawn service' }, expected: 'local_service' },
    { site: { name: 'BOOMPOW Burger & Diner', templateId: 'boompow-diner', prompt: 'Vegan food burgers' }, expected: 'food_restaurant' },
    { site: { name: 'PixelVerse 2D Arcade', templateId: 'pixel-arcade', prompt: 'Canvas arcade game' }, expected: 'game_arcade' },
    { site: { name: 'Hacker Portfolio V2', templateId: '1nc0gn30', prompt: 'Hacker CLI terminal' }, expected: 'developer_terminal' },
    { site: { name: '100 Websites in 30 Days', templateId: '30-days-challenge', prompt: 'Bootcamp course tracker' }, expected: 'challenge_course' },
    { site: { name: 'Solana Staking Pool', templateId: 'solana-defi', prompt: 'Web3 crypto wallet staking' }, expected: 'crypto_web3' },
    { site: { name: 'MayaGrowth Creator App', templateId: 'creator-playbook', prompt: 'Drink cup bio link' }, expected: 'creator_agency' },
    { site: { name: 'Lumina Compute Cloud', templateId: 'saas-cluster', prompt: 'AI neural engine' }, expected: 'saas_infra' }
  ];

  testCases.forEach(tc => {
    const arch = ZothSwarmOrchestrator.detectArchetype(tc.site);
    assert.strictEqual(arch, tc.expected, `Failed for site: ${tc.site.name} (got ${arch}, expected ${tc.expected})`);
  });
});

test('generateRouteSuite builds all 6 multi-page routes for local_service with interactive rate slider', () => {
  const site = {
    name: 'Precision Grounds Care',
    tagline: 'Virginia Beach Mowing & Aeration',
    templateId: 'lawn-grounds',
    prompt: 'Lawn landscaping services'
  };

  const routes = ZothSwarmOrchestrator.generateRouteSuite(site);
  assert.ok(routes['index.html']);
  assert.ok(routes['features.html']);
  assert.ok(routes['pricing.html']);
  assert.ok(routes['docs.html']);
  assert.ok(routes['about.html']);
  assert.ok(routes['contact.html']);

  assert.ok(routes['index.html'].includes('calcSqftRange'));
  assert.ok(routes['index.html'].includes('Direct Dispatch'));
  assert.ok(routes['index.html'].includes('Precision Mowing & Trimming'));
  assert.ok(routes['index.html'].includes('Virginia Beach'));
});

test('generateRouteSuite builds all 6 multi-page routes for food_restaurant with online cart', () => {
  const site = {
    name: 'BOOMPOW Oceanfront Diner',
    tagline: '100% Plant-Based Smash Burgers',
    templateId: 'boompow-diner',
    prompt: 'Burger restaurant'
  };

  const routes = ZothSwarmOrchestrator.generateRouteSuite(site);
  assert.ok(routes['index.html'].includes('Boom Pow Classic Smash'));
  assert.ok(routes['index.html'].includes('addToCart'));
  assert.ok(routes['index.html'].includes('cartHeaderBadge'));
  assert.ok(routes['index.html'].includes('Kitchen Status:'));
});

test('generateRouteSuite builds all 6 multi-page routes for game_arcade with playable 60 FPS canvas', () => {
  const site = {
    name: 'PixelVerse Cosmic Arena',
    tagline: 'Retro WebGL Arcade Combat',
    templateId: 'pixelverse-arcade',
    prompt: 'Arcade mini game'
  };

  const routes = ZothSwarmOrchestrator.generateRouteSuite(site);
  assert.ok(routes['index.html'].includes('gameCanvas'));
  assert.ok(routes['index.html'].includes('renderGameFrame'));
  assert.ok(routes['index.html'].includes('HIGH SCORE:'));
});

test('generateRouteSuite builds all 6 multi-page routes for developer_terminal with interactive bash shell', () => {
  const site = {
    name: 'Sovereign Hacker Deck',
    tagline: 'AST Compilers & Local Security Recon',
    templateId: '1nc0gn30',
    prompt: 'Developer CLI terminal'
  };

  const routes = ZothSwarmOrchestrator.generateRouteSuite(site);
  assert.ok(routes['index.html'].includes('termInput'));
  assert.ok(routes['index.html'].includes('handleTermKey'));
  assert.ok(routes['index.html'].includes('KERNEL: 6.8.0-PARROT-SOVEREIGN'));
});

test('orchestrateSwarm runs streaming synthesis and completes callback', (t, done) => {
  const site = {
    name: 'Vortex Engine',
    tagline: '60 FPS WebGL Game Engine',
    templateId: 'vortex-arcade',
    prompt: 'Arcade game'
  };

  let startCalls = 0;
  let logCalls = 0;

  ZothSwarmOrchestrator.orchestrateSwarm(site, { mode: 'test', stepDelay: 10 }, {
    onAgentStart: (agent, idx) => {
      startCalls++;
    },
    onLog: (msg) => {
      logCalls++;
    },
    onComplete: (routes, feedback) => {
      assert.strictEqual(startCalls, 21);
      assert.ok(logCalls >= 21);
      assert.ok(routes['index.html']);
      assert.ok(routes['pricing.html']);
      assert.ok(feedback);
      assert.strictEqual(feedback.score, 98);
      done();
    }
  });
});

test('generatePostGenerationFeedback generates tailored recommendations and quickActions', () => {
  const site = {
    name: 'Hampton Roads Turf Pros',
    templateId: 'lawn-care',
    prompt: 'Lawn landscaping'
  };

  const feedback = ZothSwarmOrchestrator.generatePostGenerationFeedback(site, {}, {});
  assert.ok(feedback);
  assert.strictEqual(feedback.score, 98);
  assert.strictEqual(feedback.grade, 'A+');
  assert.ok(feedback.recommendations.length >= 3);
  assert.ok(feedback.quickActions.length >= 4);
});

