import assert from 'node:assert/strict';
import test from 'node:test';
import { clampWindow, eventBounds, eventsInWindow, fitEvents, formatTimelineYear, groupMarkers, timelineDomain, zoomIntoGroup } from '../src/lib/timeline.js';

const point = (id, year) => ({ id, time: { kind: 'calendar', start: year } });

test('scientific ages and archaeological uncertainty share a normalized axis', () => {
  assert.deepEqual(eventBounds({ id: 'universe', time: { kind: 'age', years: 13800000000, reference_year: 2000 } }), [-13799998000, -13799998000]);
  assert.deepEqual(eventBounds({ id: 'footprints', time: { kind: 'age', years: 23000, youngest_years: 21000, reference_year: 2000, range: 'uncertainty' } }), [-21000, -19000]);
});

test('malformed dates and untyped intervals cannot become timeline coordinates', () => {
  for (const time of [
    { kind: 'calendar', start: 5, end: 4, range: 'duration' },
    { kind: 'calendar', start: 1, end: 2 },
    { kind: 'calendar', start: 1, end: null },
    { kind: 'age', years: 100, reference_year: 2000, youngest_years: 200 },
    { kind: 'age', years: Infinity, reference_year: 2000 },
    { kind: 'age', years: 100 },
  ]) assert.throws(() => eventBounds({ id: 'invalid', time }), /Invalid timeline date/);
});

test('window filtering includes spanning intervals and both endpoints', () => {
  const events = [
    point('outside', -1), point('left', 0), point('right', 10),
    { id: 'spans', time: { kind: 'calendar', start: -5, end: 15, range: 'duration' } },
  ];
  assert.deepEqual(eventsInWindow(events, [0, 10]).map((event) => event.id), ['left', 'right', 'spans']);
});

test('zoom and pan preserve domain boundaries and a minimum one-year window', () => {
  assert.deepEqual(clampWindow(-100, 20, [0, 100]), [0, 20]);
  assert.deepEqual(clampWindow(200, 20, [0, 100]), [80, 100]);
  assert.deepEqual(clampWindow(50, 1000, [0, 100]), [0, 100]);
  assert.deepEqual(clampWindow(50, 0.01, [0, 100]), [49.5, 50.5]);
  const events = [point('single', 2000)];
  assert.deepEqual(timelineDomain(events), [1999, 2001]);
  assert.deepEqual(fitEvents(events, [1900, 2025]), [1999.5, 2000.5]);
});

test('clusters conserve every visible event and expand to include their full intervals', () => {
  const events = [point('a', 0), point('b', 5), point('c', 6), point('d', 95), point('outside', 200)];
  const groups = groupMarkers(events, [0, 100]);
  assert.deepEqual(groups.map((group) => group.events.map((event) => event.id)), [['a', 'b', 'c'], ['d']]);
  const window = fitEvents(groups[0].events, [0, 100]);
  assert.equal(window[0], 0);
  assert.ok(window[1] >= 6 && window[1] < 100);
  const spreadOut = Array.from({ length: 11 }, (_, index) => point(`spread-${index}`, index * 9));
  assert.ok(groupMarkers(spreadOut, [0, 100]).length > 1, 'Neighboring points must not chain into one unzoomable cluster');
});

test('axis labels use scientific units and never show a historical year zero', () => {
  assert.equal(formatTimelineYear(-13799998000, 'en'), '13.8 Ga');
  assert.equal(formatTimelineYear(-65998000, 'es'), '66 Ma');
  assert.equal(formatTimelineYear(0, 'en'), '1 BCE');
  assert.equal(formatTimelineYear(-1, 'en'), '2 BCE');
  assert.equal(formatTimelineYear(2025, 'es'), '2025 d. C.');
});

test('drilling into a cluster with a long interval never zooms back out', () => {
  const events = [
    { id: 'long-period', time: { kind: 'calendar', start: -1000, end: 2000, range: 'duration' } },
    point('inside', 150),
  ];
  const group = groupMarkers(events, [100, 200])[0];
  assert.deepEqual(zoomIntoGroup(group, [100, 200]), [125, 175]);
  assert.deepEqual(zoomIntoGroup(group, [149.5, 150.5]), [149.5, 150.5]);
});
