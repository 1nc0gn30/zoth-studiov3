const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');

const Spawner = require('./site-workspace-spawner.js');

test('ZothWorkspaceSpawner module exists and has valid metadata', (t) => {
  assert.ok(Spawner, 'Spawner module should be loaded');
  assert.strictEqual(typeof Spawner.VERSION, 'string', 'Should have a version string');
  assert.ok(Array.isArray(Spawner.AGENT_LIFECYCLE_STAGES), 'Should have lifecycle stages list');
  assert.strictEqual(Spawner.AGENT_LIFECYCLE_STAGES.length, 6, 'Should have 6 lifecycle stages');
});

test('createSlug creates clean filesystem and URL safe slugs', (t) => {
  assert.strictEqual(Spawner.createSlug('Solaris Clean Energy Corp!'), 'solaris-clean-energy-corp');
  assert.strictEqual(Spawner.createSlug('100 Websites in 30 Days (Rebrand)'), '100-websites-in-30-days-rebrand');
  assert.ok(Spawner.createSlug('   ').startsWith('project'), 'Empty string falls back to project slug');
});

test('startAgentSwarmSession executes staged lifecycle and completes callback', (t, done) => {
  let progressUpdates = [];
  let logEntries = [];

  const session = Spawner.startAgentSwarmSession(
    {
      projectName: 'Aether Cloud Engine',
      durationMs: 80, // Rapid test duration
      templateId: '100-websites-in-30-days'
    },
    (update) => {
      progressUpdates.push(update.progress);
      if (update.log) logEntries.push(update.log);
    },
    (completedSession) => {
      assert.strictEqual(completedSession.status, 'READY');
      assert.strictEqual(completedSession.projectName, 'Aether Cloud Engine');
      assert.strictEqual(completedSession.progress, 100);
      assert.ok(progressUpdates.length > 0, 'Should have received progress callbacks');
      assert.ok(logEntries.length > 0, 'Should have received log entries');
      done();
    }
  );

  assert.strictEqual(session.status, 'BUILDING');
  assert.ok(session.workspaceName.includes('aether-cloud-engine'));
});
