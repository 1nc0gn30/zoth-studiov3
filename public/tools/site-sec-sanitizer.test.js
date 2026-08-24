const test = require('node:test');
const assert = require('node:assert/strict');
const ZothSanitizer = require('./site-sec-sanitizer.js');

test('ZothSanitizer version exists', () => {
  assert.equal(ZothSanitizer.VERSION, '3.0.0');
});

test('Sanitizer strips inline scripts', () => {
  const dirty = '<div>Hello <script>alert("xss")</script> World</div>';
  const clean = ZothSanitizer.sanitize(dirty);
  assert.equal(clean, '<div>Hello  World</div>');
});

test('Sanitizer strips inline event handlers', () => {
  const dirty = '<img src="avatar.jpg" onerror="alert(1)" onload="fetch(\'/steal\')" alt="Azoth">';
  const clean = ZothSanitizer.sanitize(dirty);
  assert.equal(clean, '<img src="avatar.jpg" alt="Azoth">');
});

test('Sanitizer strips javascript: pseudoprotocol in href', () => {
  const dirty = '<a href="javascript:alert(document.cookie)">Click Me</a>';
  const clean = ZothSanitizer.sanitize(dirty);
  assert.equal(clean, '<a href="#">Click Me</a>');
});

test('Sanitizer strips dangerous iframes and objects', () => {
  const dirty = '<p>Normal</p><iframe src="https://evil.com"></iframe><object data="evil.swf"></object>';
  const clean = ZothSanitizer.sanitize(dirty);
  assert.equal(clean, '<p>Normal</p>');
});

test('Sanitizer handles nested script tags', () => {
  const dirty = '<scr<script>ipt>alert(1)</script>';
  const clean = ZothSanitizer.sanitize(dirty);
  assert.equal(clean.includes('script'), false);
});

test('Audit method returns finding report and risk score', () => {
  const dirty = '<img src="x" onerror="alert(1)"><script>bad()</script>';
  const report = ZothSanitizer.audit(dirty);
  assert.equal(report.is_safe, false);
  assert.ok(report.risk_score >= 50);
  assert.equal(report.findings.length, 2);
});
