const test = require('node:test');
const assert = require('node:assert');
const ZothAdvancedConfigurator = require('./site-advanced-configurator.js');

test('ZothAdvancedConfigurator has version 4.0.0', () => {
  assert.strictEqual(ZothAdvancedConfigurator.VERSION, '4.0.0');
});

test('Hosting providers include Netlify, Vercel, Cloudflare, Render, AWS, and Sovereign Docker', () => {
  const providers = Object.keys(ZothAdvancedConfigurator.HOSTING_PROVIDERS);
  assert.ok(providers.includes('netlify'));
  assert.ok(providers.includes('vercel'));
  assert.ok(providers.includes('cloudflare'));
  assert.ok(providers.includes('render'));
  assert.ok(providers.includes('aws'));
  assert.ok(providers.includes('sovereign'));

  const site = { name: 'Apex AI' };
  assert.ok(ZothAdvancedConfigurator.getHostingProvider('netlify').generateConfig(site).includes('[[redirects]]'));
  assert.ok(ZothAdvancedConfigurator.getHostingProvider('vercel').generateConfig(site).includes('"framework": "nextjs"'));
  assert.ok(ZothAdvancedConfigurator.getHostingProvider('cloudflare').generateConfig(site).includes('pages_build_output_dir'));
  assert.ok(ZothAdvancedConfigurator.getHostingProvider('render').generateConfig(site).includes('services:'));
  assert.ok(ZothAdvancedConfigurator.getHostingProvider('sovereign').generateConfig(site).includes('FROM nginx:alpine'));
});

test('Framework adapters generate valid package.json configs', () => {
  const frameworks = ['nextjs', 'astro', 'vite_react', 'sveltekit', 'static_html'];
  for (const f of frameworks) {
    const fw = ZothAdvancedConfigurator.getFramework(f);
    assert.ok(fw.name);
    const pkg = fw.packageJson('Test App');
    assert.strictEqual(pkg.name, 'test-app');
  }
});

test('Design libraries provide rich UI classes', () => {
  const designs = ['tailwind_magic', 'shadcn_radix', 'threejs_webgl', 'framer_motion', 'cyber_obsidian'];
  for (const d of designs) {
    const dl = ZothAdvancedConfigurator.getDesignLibrary(d);
    assert.ok(dl.name);
    assert.ok(dl.cssClasses.card);
    assert.ok(dl.cssClasses.button);
    assert.ok(dl.cssClasses.badge);
  }
});

test('Connectors produce type-safe helpers and environment variables', () => {
  const connectors = ['stripe_payments', 'solana_web3', 'supabase_auth', 'argon2_vault', 'resend_email', 'privacy_telemetry'];
  for (const c of connectors) {
    const conn = ZothAdvancedConfigurator.getConnector(c);
    assert.ok(conn.name);
    assert.ok(conn.envKeys.length > 0);
    const helperCode = conn.generateHelper();
    assert.ok(helperCode.length > 20);
  }

  const envFile = ZothAdvancedConfigurator.generateEnvExample(['stripe_payments', 'supabase_auth']);
  assert.ok(envFile.includes('STRIPE_SECRET_KEY'));
  assert.ok(envFile.includes('NEXT_PUBLIC_SUPABASE_URL'));
});

test('bundleCompleteRepository outputs all necessary repository files for zip export', () => {
  const site = {
    name: 'Quantum Cyber Forge',
    tagline: 'Autonomous AI Security',
    theme: { bg: '#040711', accent: '#00f0ff', surface: '#0a1226' }
  };

  const files = ZothAdvancedConfigurator.bundleCompleteRepository(site, {
    hosting: 'netlify',
    framework: 'nextjs',
    design: 'tailwind_magic',
    connectors: ['stripe_payments', 'resend_email', 'privacy_telemetry']
  });

  assert.ok(files['README.md']);
  assert.ok(files['netlify.toml']);
  assert.ok(files['package.json']);
  assert.ok(files['.env.example']);
  assert.ok(files['tailwind.config.js']);
  assert.ok(files['src/lib/connectors/stripe_payments.js']);
  assert.ok(files['src/lib/connectors/resend_email.js']);
  assert.ok(files['src/lib/connectors/privacy_telemetry.js']);
});
