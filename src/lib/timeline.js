export const categories = ['cosmos', 'earth', 'humanity', 'ancient', 'medieval', 'early-modern', 'modern', 'contemporary'];
export const minimumSpan = 1;

export function eventBounds(event) {
  const time = event.time;
  const invalid = () => { throw new Error(`Invalid timeline date: ${event.id}`); };
  if (!time || !['calendar', 'age'].includes(time.kind)) invalid();
  if (time.approximate !== undefined && typeof time.approximate !== 'boolean') invalid();
  if (time.range !== undefined && !['duration', 'uncertainty'].includes(time.range)) invalid();
  let start;
  let end;
  if (time.kind === 'age') {
    if (!Number.isFinite(time.years) || time.years <= 0 || !Number.isInteger(time.reference_year)) invalid();
    const youngest = time.youngest_years === undefined ? time.years : time.youngest_years;
    if (!Number.isFinite(youngest) || youngest <= 0 || youngest > time.years) invalid();
    start = time.reference_year - time.years;
    end = time.reference_year - youngest;
  } else {
    start = time.start;
    end = time.end === undefined ? start : time.end;
    if (!Number.isInteger(start) || !Number.isInteger(end)) invalid();
  }
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end
    || Math.abs(start) > Number.MAX_SAFE_INTEGER || Math.abs(end) > Number.MAX_SAFE_INTEGER) invalid();
  if (start !== end && !time.range) invalid();
  return [start, end];
}

export function eventExtent(events) {
  if (!events.length) throw new Error('Cannot determine the extent of an empty timeline');
  const bounds = events.map(eventBounds);
  return [Math.min(...bounds.map(([start]) => start)), Math.max(...bounds.map(([, end]) => end))];
}

export function timelineDomain(events) {
  const [start, end] = eventExtent(events);
  return start === end ? [start - 1, end + 1] : [start, end];
}

export function clampWindow(center, span, domain) {
  const width = Math.min(Math.max(span, minimumSpan), domain[1] - domain[0]);
  const start = Math.max(domain[0], Math.min(center - width / 2, domain[1] - width));
  return [start, Math.min(domain[1], start + width)];
}

export function fitEvents(events, domain) {
  const [start, end] = eventExtent(events);
  return clampWindow((start + end) / 2, Math.max((end - start) * 1.12, minimumSpan), domain);
}

export function eventsInWindow(events, window) {
  return events.filter((event) => {
    const [start, end] = eventBounds(event);
    return start <= window[1] && end >= window[0];
  });
}

export function groupMarkers(events, window) {
  const span = window[1] - window[0];
  const markers = eventsInWindow(events, window).map((event) => {
    const [start, end] = eventBounds(event);
    const midpoint = (Math.max(start, window[0]) + Math.min(end, window[1])) / 2;
    return { event, position: (midpoint - window[0]) / span };
  }).sort((a, b) => a.position - b.position);
  const groups = [];
  for (const marker of markers) {
    const previous = groups.at(-1);
    if (previous && marker.position - previous.firstPosition < 0.1) {
      previous.events.push(marker.event);
      previous.totalPosition += marker.position;
      previous.position = previous.totalPosition / previous.events.length;
    } else {
      groups.push({
        events: [marker.event],
        position: marker.position,
        totalPosition: marker.position,
        firstPosition: marker.position,
      });
    }
  }
  return groups;
}

export function zoomIntoGroup(group, window) {
  const span = window[1] - window[0];
  const fitted = fitEvents(group.events, window);
  return clampWindow(window[0] + group.position * span, Math.min(span / 2, fitted[1] - fitted[0]), window);
}

export function formatTimelineYear(year, language) {
  const number = new Intl.NumberFormat(language, { maximumFractionDigits: 2 });
  const age = 2000 - year;
  if (age >= 1e9) return `${number.format(age / 1e9)} Ga`;
  if (age >= 1e6) return `${number.format(age / 1e6)} Ma`;
  if (age >= 12000) return `${number.format(age / 1000)} ka`;
  const rounded = Math.round(year);
  const calendar = new Intl.NumberFormat(language, { useGrouping: false });
  return rounded <= 0
    ? `${calendar.format(1 - rounded)} ${language === 'es' ? 'a. C.' : 'BCE'}`
    : `${calendar.format(rounded)} ${language === 'es' ? 'd. C.' : 'CE'}`;
}
