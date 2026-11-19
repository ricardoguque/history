import assert from 'node:assert/strict';
import test from 'node:test';
import { githubEditUrl, loadCatalog, parseYaml, validateCatalog } from '../src/lib/catalog.js';

test('sample catalog loads with valid bilingual content and reading references', async () => {
  const catalog = await loadCatalog();
  assert.ok(catalog.events.length > 0);
  assert.ok(catalog.books.length > 0);
});

test('GitHub editing targets only supported data files on main', () => {
  assert.equal(githubEditUrl('data/events.yaml'), 'https://github.com/ricardoguque/history/edit/main/data/events.yaml');
  assert.equal(githubEditUrl('data/reading.yaml'), 'https://github.com/ricardoguque/history/edit/main/data/reading.yaml');
  assert.throws(() => githubEditUrl('../secrets'), /Unknown editable file/);
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
  ];
  for (const [mutate, expected] of cases) {
    const data = structuredClone(original);
    mutate(data);
    assert.throws(() => validateCatalog(data), expected);
  }
});
