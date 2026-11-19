import { clampWindow, eventBounds, formatTimelineYear, groupMarkers, minimumSpan, zoomIntoGroup } from '../lib/timeline.js';

const labels = {
  es: {
    title: 'Una ventana al tiempo',
    before: 'Desplazar hacia el pasado',
    after: 'Desplazar hacia el presente',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    reset: 'Ver todo',
    group: 'hitos; acercar este grupo',
    duration: 'Duración',
    uncertainty: 'Fecha incierta',
    help: 'Pulsa un grupo para acercarte o usa los periodos. Eje lineal; zoom mínimo de un año. Ga, Ma y ka indican miles de millones, millones y miles de años antes de 2000, referencia visual convencional.',
  },
  en: {
    title: 'A window into time',
    before: 'Pan toward the past',
    after: 'Pan toward the present',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Show all',
    group: 'events; zoom into this group',
    duration: 'Duration',
    uncertainty: 'Uncertain date',
    help: 'Select a cluster to zoom in, or choose a period. Linear axis; minimum zoom is one year. Ga, Ma, and ka mean billions, millions, and thousands of years before 2000, a conventional visual reference.',
  },
};

export default function Chronology({ events, window, domain, language, onChange, onReset, onSelect }) {
  const t = labels[language];
  const span = window[1] - window[0];
  const center = (window[0] + window[1]) / 2;
  const groups = groupMarkers(events, window);
  const position = (year) => 4 + 92 * (year - window[0]) / span;
  const bands = events.filter((event) => event.time.range).map((event) => {
    const [start, end] = eventBounds(event);
    const left = position(Math.max(start, window[0]));
    const right = position(Math.min(end, window[1]));
    return { event, left, width: right - left };
  }).filter((band) => band.width > 0.3);

  return (
    <section className="chronology" aria-label={t.title}>
      <div className="chronology-toolbar">
        <p className="eyebrow">{t.title}</p>
        <div className="zoom-controls">
          <button type="button" onClick={() => onChange(clampWindow(center - span / 2, span, domain))} disabled={window[0] <= domain[0]} aria-label={t.before}>←</button>
          <button type="button" onClick={() => onChange(clampWindow(center, span * 2, domain))} disabled={span >= domain[1] - domain[0]} aria-label={t.zoomOut}>−</button>
          <button type="button" onClick={() => onChange(clampWindow(center, span / 2, domain))} disabled={span <= minimumSpan} aria-label={t.zoomIn}>+</button>
          <button type="button" onClick={() => onChange(clampWindow(center + span / 2, span, domain))} disabled={window[1] >= domain[1]} aria-label={t.after}>→</button>
          <button type="button" className="reset-window" onClick={onReset}>{t.reset}</button>
        </div>
      </div>
      <div className="chronology-track" role="group" aria-label={t.title}>
        <div className="chronology-axis" />
        {bands.map(({ event, left, width }, index) => (
          <span key={event.id} className={`range-band ${event.time.range}`} style={{ left: `${left}%`, width: `${width}%`, top: `${70 + (index % 3) * 7}px` }} aria-hidden="true" />
        ))}
        {groups.map((group) => (
          <button
            type="button"
            className={`time-marker ${group.events.length > 1 ? 'cluster' : ''}`}
            style={{ left: `${4 + 92 * group.position}%` }}
            key={group.events[0].id}
            disabled={group.events.length > 1 && span <= minimumSpan}
            aria-label={group.events.length > 1 ? `${group.events.length} ${t.group}` : group.events[0].title[language]}
            title={group.events.map((event) => event.title[language]).join(' · ')}
            onClick={() => group.events.length > 1
              ? onChange(zoomIntoGroup(group, window))
              : onSelect(group.events[0].id)}
          >{group.events.length > 1 ? group.events.length : <span aria-hidden="true">✦</span>}</button>
        ))}
      </div>
      <div className="axis-labels" aria-live="polite">
        {[window[0], center, window[1]].map((year, index) => <span key={index}>{formatTimelineYear(year, language)}</span>)}
      </div>
      <div className="range-legend"><span className="duration">{t.duration}</span><span className="uncertainty">{t.uncertainty}</span></div>
      <p className="chronology-help">{t.help}</p>
    </section>
  );
}
