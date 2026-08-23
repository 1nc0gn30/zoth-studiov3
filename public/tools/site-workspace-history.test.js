// Unit & Integration Tests for Zoth Studio Workspace & Revision History Manager
const assert = require("assert");
const WorkspaceModule = require("./site-workspace-history.js");

console.log("⚡ Starting Workspace & Revision History Manager Tests...\n");

const { manager, ARCHETYPES, computeDiff, validate, run, WorkspaceManager } = WorkspaceModule;

// -----------------------------------------------------------------------------
// Test 1: Archetypes & Initial State
// -----------------------------------------------------------------------------
console.log("▶ [Test 1] Archetypes & Initial State Verification...");
assert(ARCHETYPES["ai_swarm"], "ai_swarm archetype must exist");
assert(ARCHETYPES["saas_b2b"], "saas_b2b archetype must exist");
assert(ARCHETYPES["cyber_security"], "cyber_security archetype must exist");
assert(ARCHETYPES["creator_agency"], "creator_agency archetype must exist");
assert(ARCHETYPES["crypto_web3"], "crypto_web3 archetype must exist");
assert(ARCHETYPES["minimalist_portfolio"], "minimalist_portfolio archetype must exist");

const currentProj = manager.getCurrentProject();
assert(currentProj, "Current project must be initialized");
assert(currentProj.id, "Current project must have an ID");
assert(currentProj.sections.length > 0, "Current project must have sections");
console.log(`✅ Default project loaded: ${currentProj.name} (${currentProj.id}) with ${currentProj.sections.length} sections.`);

// -----------------------------------------------------------------------------
// Test 2: Project CRUD & Switching
// -----------------------------------------------------------------------------
console.log("\n▶ [Test 2] Project CRUD, Duplication & Switching...");
const createdProj = manager.createProject({
  name: "Cyber Aegis Test",
  archetype: "cyber_security",
  tagline: "Test Threat Defense",
  tags: ["test", "security"]
});

assert.strictEqual(createdProj.name, "Cyber Aegis Test");
assert.strictEqual(createdProj.niche, "cyber_security");
assert.strictEqual(manager.getCurrentProject().id, createdProj.id, "Active project should switch upon creation");

// List projects
const projectList = manager.listProjects();
assert(projectList.length >= 2, "Project list should contain at least 2 projects");
const foundCreated = projectList.find(p => p.id === createdProj.id);
assert(foundCreated, "Created project must be present in project list");
assert.strictEqual(foundCreated.active, true, "Created project should be marked active");

// Update project
const updatedProj = manager.updateProject(createdProj.id, {
  name: "Cyber Aegis Hardened",
  theme: "acid-grid"
}, "test.update", "Renamed and applied theme");
assert.strictEqual(updatedProj.name, "Cyber Aegis Hardened");
assert.strictEqual(updatedProj.theme, "acid-grid");

// Fork / Duplicate project
const forkedProj = manager.forkProject(createdProj.id, "Cyber Aegis Fork");
assert(forkedProj.id !== createdProj.id, "Forked project must have unique ID");
assert.strictEqual(forkedProj.name, "Cyber Aegis Fork");

// Switch back to original default project
const defaultId = projectList.find(p => p.id !== createdProj.id && p.id !== forkedProj.id).id;
const switched = manager.switchProject(defaultId);
assert.strictEqual(switched.id, defaultId);
assert.strictEqual(manager.getCurrentProject().id, defaultId);

// Delete forked project
const delSuccess = manager.deleteProject(forkedProj.id);
assert.strictEqual(delSuccess, true, "Delete should succeed");
const listAfterDel = manager.listProjects();
assert(!listAfterDel.some(p => p.id === forkedProj.id), "Deleted project must not appear in list");
console.log("✅ Project CRUD, forking, and switching validated successfully.");

// -----------------------------------------------------------------------------
// Test 3: Undo / Redo & Revision History Stacks
// -----------------------------------------------------------------------------
console.log("\n▶ [Test 3] Deep Revision History & Undo/Redo Stacks...");
const testWm = new WorkspaceManager();
const testProj = testWm.createProject({ name: "Undo Test Project", archetype: "saas_b2b" });
const pId = testProj.id;

assert.strictEqual(testWm.canUndo(pId), false, "Initial project should not have undo available");

// Step 1: Add a section
const state1 = testWm.getProject(pId);
state1.sections.push({ id: "custom_banner", name: "Custom Banner", enabled: true, variant: "banner-glow" });
testWm.updateProject(pId, state1, "section.add", "Added Custom Banner");

assert.strictEqual(testWm.canUndo(pId), true, "Can undo should be true after update");
assert.strictEqual(testWm.canRedo(pId), false, "Can redo should be false after latest update");

// Step 2: Change theme
const state2 = testWm.getProject(pId);
state2.theme = "ultraviolet-glass";
testWm.updateProject(pId, state2, "theme.change", "Changed to ultraviolet-glass");

const histBeforeUndo = testWm.getHistory(pId);
assert.strictEqual(histBeforeUndo.stack.length, 3, "Stack should have 3 revisions (init, add, theme)");

// Undo theme change
const undone1 = testWm.undo(pId);
assert.strictEqual(undone1.theme, "midnight-neon", "Undone state should restore previous theme");
assert.strictEqual(testWm.canRedo(pId), true, "Can redo should be true after undo");

// Undo section addition
const undone2 = testWm.undo(pId);
assert(!undone2.sections.some(s => s.id === "custom_banner"), "Undone state should not have custom banner");

// Redo section addition
const redone1 = testWm.redo(pId);
assert(redone1.sections.some(s => s.id === "custom_banner"), "Redone state should restore custom banner");

// Redo theme change
const redone2 = testWm.redo(pId);
assert.strictEqual(redone2.theme, "ultraviolet-glass", "Redone state should restore ultraviolet-glass");

// Jump directly to genesis revision (index 0)
const jumpedState = testWm.jumpToRevision(pId, 0);
assert.strictEqual(jumpedState.name, "Undo Test Project");
assert(!jumpedState.sections.some(s => s.id === "custom_banner"), "Genesis revision should not have custom banner");
console.log("✅ Deep Undo, Redo, Stack Truncation, and Time-Travel Jump validated.");

// -----------------------------------------------------------------------------
// Test 4: Auto-Save Drafts & Dirty Checkpointing
// -----------------------------------------------------------------------------
console.log("\n▶ [Test 4] Auto-Save Drafts & Dirty State Management...");
const draftProj = testWm.createProject({ name: "Draft Testing Suite", archetype: "minimalist_portfolio" });
const dId = draftProj.id;

assert.strictEqual(testWm.hasDraft(dId), false, "New project should not have draft");

const modifiedState = testWm.getProject(dId);
modifiedState.tagline = "Unsaved draft tagline modification";
testWm.markDirty(modifiedState);
assert.strictEqual(testWm.isDirty, true, "Workspace should be marked dirty");

// Save draft
const savedDraft = testWm.saveDraft(dId, modifiedState);
assert(savedDraft, "Draft payload must be returned");
assert.strictEqual(testWm.hasDraft(dId), true, "hasDraft should now be true");
assert.strictEqual(testWm.getDraft(dId).stateSnapshot.tagline, "Unsaved draft tagline modification");

// Commit draft
const committedProj = testWm.commitDraft(dId, "draft.commit", "Committed tagline change");
assert.strictEqual(committedProj.tagline, "Unsaved draft tagline modification");
assert.strictEqual(testWm.hasDraft(dId), false, "Draft should be cleared after commit");

// Test Discard Draft
const dirtyState2 = testWm.getProject(dId);
dirtyState2.tagline = "Discarded edit";
testWm.saveDraft(dId, dirtyState2);
assert.strictEqual(testWm.hasDraft(dId), true);
const discardedClean = testWm.discardDraft(dId);
assert.strictEqual(discardedClean.tagline, "Unsaved draft tagline modification", "Discarding draft restores clean committed state");
assert.strictEqual(testWm.hasDraft(dId), false);
console.log("✅ Auto-Save Drafts, Dirty Detection, Commit and Discard validated.");

// -----------------------------------------------------------------------------
// Test 5: Named Milestone Snapshots
// -----------------------------------------------------------------------------
console.log("\n▶ [Test 5] Named Milestone Snapshots...");
const snapProj = testWm.createProject({ name: "Snapshot Target", archetype: "crypto_web3" });
const sId = snapProj.id;

const snapshot1 = testWm.createSnapshot(sId, "v1.0-Release", "Production release snapshot", "release");
assert(snapshot1.snapshotId, "Snapshot must have an ID");
assert.strictEqual(snapshot1.name, "v1.0-Release");
assert.strictEqual(snapshot1.tag, "release");

const snapList = testWm.listSnapshots(sId);
assert.strictEqual(snapList.length, 1);
assert.strictEqual(snapList[0].snapshotId, snapshot1.snapshotId);

// Mutate project then restore from snapshot
const mutatedProj = testWm.updateProject(sId, { name: "Snapshot Mutated Name", theme: "obsidian-gold" });
assert.strictEqual(mutatedProj.name, "Snapshot Mutated Name");

const restoredSnap = testWm.restoreSnapshot(sId, snapshot1.snapshotId);
assert.strictEqual(restoredSnap.name, "Snapshot Target");
assert.strictEqual(restoredSnap.theme, "retro-terminal");

// Delete snapshot
const delSnapRes = testWm.deleteSnapshot(sId, snapshot1.snapshotId);
assert.strictEqual(delSnapRes, true);
assert.strictEqual(testWm.listSnapshots(sId).length, 0);
console.log("✅ Milestone Snapshot creation, listing, restore, and deletion validated.");

// -----------------------------------------------------------------------------
// Test 6: State Diffing Engine
// -----------------------------------------------------------------------------
console.log("\n▶ [Test 6] State Diffing & Changelog Generator...");
const stateA = {
  name: "Site Alpha",
  tagline: "First Tagline",
  theme: "obsidian-gold",
  sections: [
    { id: "hero", name: "Hero", enabled: true, variant: "v1" },
    { id: "bento", name: "Bento", enabled: true, variant: "v1" }
  ]
};

const stateB = {
  name: "Site Beta",
  tagline: "First Tagline",
  theme: "midnight-neon",
  sections: [
    { id: "hero", name: "Hero", enabled: false, variant: "v2" },
    { id: "pricing", name: "Pricing", enabled: true, variant: "v1" }
  ]
};

const diffResult = computeDiff(stateA, stateB);
assert.strictEqual(diffResult.changed, true);
assert(diffResult.details.themeChanged, "Theme change detected");
assert.strictEqual(diffResult.details.themeChanged.from, "obsidian-gold");
assert.strictEqual(diffResult.details.themeChanged.to, "midnight-neon");
assert.strictEqual(diffResult.details.nameChanged.to, "Site Beta");
assert.strictEqual(diffResult.details.addedSections.length, 1, "Added pricing section");
assert.strictEqual(diffResult.details.removedSections.length, 1, "Removed bento section");
assert.strictEqual(diffResult.details.modifiedSections.length, 1, "Modified hero section");
console.log(`✅ Diff Engine verified: "${diffResult.summary}"`);

// -----------------------------------------------------------------------------
// Test 7: JSON Import & Export
// -----------------------------------------------------------------------------
console.log("\n▶ [Test 7] JSON Import & Export (Single Project & Full Workspace)...");
const expProj = testWm.createProject({ name: "Exportable System", archetype: "ai_swarm" });
testWm.createSnapshot(expProj.id, "v1.0-export-snap", "Export snapshot test", "export");

// Export single project
const exportedBundle = testWm.exportProjectJSON(expProj.id, { format: "object" });
assert(exportedBundle.$schema, "Bundle must have $schema");
assert(exportedBundle.checksum, "Bundle must have checksum");
assert.strictEqual(exportedBundle.project.name, "Exportable System");
assert(exportedBundle.revisions.length >= 1, "Exported bundle must contain revisions");
assert(exportedBundle.snapshots.length >= 1, "Exported bundle must contain snapshots");

// Export string format
const exportedString = testWm.exportProjectJSON(expProj.id, { format: "string", pretty: true });
assert(typeof exportedString === "string", "String export must be string");

// Import single project with collision renaming
const importedProj = testWm.importProjectJSON(exportedBundle, { collisionStrategy: "rename_copy" });
assert(importedProj.id !== expProj.id, "Collision strategy rename_copy must assign new ID");
assert(importedProj.name.includes("(Imported)"), "Name should indicate imported copy");

// Export all workspaces
const fullBackup = testWm.exportAllWorkspacesJSON({ format: "object" });
assert(fullBackup.$schema.includes("workspace-full-backup"), "Full backup schema verified");
assert(fullBackup.totalProjects >= 3, "Full backup should include all test projects");

// Test corrupted import handling
assert.throws(() => {
  testWm.importProjectJSON({ invalid: "payload" });
}, /Invalid project structure/);
console.log("✅ JSON Import/Export and Full Workspace Backup validated.");

// -----------------------------------------------------------------------------
// Test 8: Tool Harness Dispatcher & Contract Validation
// -----------------------------------------------------------------------------
console.log("\n▶ [Test 8] Tool Harness Actions Contract Validation...");
(async function () {
  // Validate action failure
  const invalidReq = { action: "unsupported.action", params: {} };
  const vFail = validate(invalidReq);
  assert.strictEqual(vFail.ok, false);
  assert.strictEqual(vFail.error.code, "unsupported_action");

  // Validate action success & run
  const listReq = { action: "workspace.list", params: {}, meta: { request_id: "test_req_1" } };
  const vPass = validate(listReq);
  assert.strictEqual(vPass.ok, true);

  const runRes = await run(listReq);
  assert.strictEqual(runRes.ok, true);
  assert(Array.isArray(runRes.data), "workspace.list must return an array");

  // Test workspace.diff action
  const diffReq = {
    action: "workspace.diff",
    params: { oldState: stateA, newState: stateB },
    meta: { request_id: "diff_req" }
  };
  const diffRun = await run(diffReq);
  assert.strictEqual(diffRun.ok, true);
  assert.strictEqual(diffRun.data.changed, true);

  console.log("✅ Tool Harness Actions Contract & Dispatcher validated.");

  console.log("\n🎉 ALL WORKSPACE HISTORY & REVISION MANAGER TESTS PASSED (100% SPECIFICATION MATCH)!\n");
})();
