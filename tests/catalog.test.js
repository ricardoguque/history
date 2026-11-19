import assert from 'node:assert/strict';
import test from 'node:test';
import { githubEditUrl, loadCatalog, parseYaml, validateCatalog, validateManifest } from '../src/lib/catalog.js';
import { eventBounds } from '../src/lib/timeline.js';

test('split catalog loads chronologically with per-event editing destinations', async () => {
  const catalog = await loadCatalog();
  assert.ok(catalog.events.length > 0);
  assert.ok(catalog.books.length > 0);
  for (const [index, event] of catalog.events.entries()) {
    assert.match(githubEditUrl(event.dataFile), /\/edit\/main\/data\/events\/[a-z-]+\.yaml$/);
    if (index) assert.ok(eventBounds(catalog.events[index - 1])[0] <= eventBounds(event)[0]);
  }
});

test('GitHub editing targets only supported data files on main', () => {
  assert.equal(githubEditUrl('data/events/cosmos.yaml'), 'https://github.com/ricardoguque/history/edit/main/data/events/cosmos.yaml');
  assert.equal(githubEditUrl('data/reading.yaml'), 'https://github.com/ricardoguque/history/edit/main/data/reading.yaml');
  assert.throws(() => githubEditUrl('../secrets'), /Unknown editable file/);
  assert.throws(() => githubEditUrl('data/events/../reading.yaml'), /Unknown editable file/);
});

test('event file manifest rejects traversal, duplicate files, and unsupported versions', () => {
  for (const manifest of [
    { schema_version: 1, event_files: ['../outside.yaml'] },
    { schema_version: 1, event_files: ['data/events/cosmos.yaml', 'data/events/cosmos.yaml'] },
    { schema_version: 2, event_files: ['data/events/cosmos.yaml'] },
    { schema_version: 1, event_files: [] },
  ]) {
    assert.throws(() => validateManifest(manifest), /Invalid event file manifest/);
  }
});

test('duplicate YAML keys cannot silently overwrite data', () => {
  assert.throws(() => parseYaml('events: []\nevents: []', 'test.yaml'), /test.yaml/);
});

test('invalid edits fail validation instead of publishing broken data', async () => {
  const original = await loadCatalog();
  const cases = [
    [(data) => data.events.push({ ...data.events[0] }), /Duplicate events id/],
    [(data) => delete data.events[0].title.en, /title.en/],
    [(data) => { data.reading.events.missing = 'read'; }, /Unknown reading reference/],
    [(data) => { data.reading.events.universe = 'done'; }, /Invalid reading state/],
    [(data) => { data.events[0].source.url = 'javascript:alert(1)'; }, /HTTPS/],
    [(data) => { data.books[0].year = '1980'; }, /Invalid book year/],
    [(data) => { data.events[0].books = ['missing']; }, /Unknown book recommendation/],
    [(data) => { data.events[0].books = ['cosmos', 'cosmos']; }, /Invalid book recommendations/],
    [(data) => { data.events[0].time.years = 'unknown'; }, /Invalid timeline date/],
    [(data) => { data.events[0].category = 'unknown'; }, /Invalid event category/],
  ];
  for (const [mutate, expected] of cases) {
    const data = structuredClone(original);
    mutate(data);
    assert.throws(() => validateCatalog(data), expected);
  }
});
