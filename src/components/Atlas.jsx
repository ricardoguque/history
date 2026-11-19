import { useState } from 'react';

const labels = {
  es: {
    eyebrow: 'UN ATLAS PERSONAL DEL TIEMPO',
    heading: 'Todo tiene',
    emphasis: 'una historia.',
    intro: 'Del primer destello a las ideas que cambiaron el mundo. Explora el pasado, sigue las conexiones y construye tu propia biblioteca del tiempo.',
    explore: 'Explorar capítulos',
    libraryLink: 'Mi biblioteca',
    chapter: '01 / EXPLORAR',
    timeline: 'Un viaje sin prisa.',
    scale: 'Vista por capítulos · distancias no proporcionales al tiempo',
    categories: { all: 'Todo el recorrido', cosmos: 'El cosmos', humanity: 'La humanidad', modern: 'El mundo moderno' },
    unread: 'Por leer', reading: 'En lectura', read: 'Leído',
    detail: 'EN ESTE MOMENTO',
    source: 'Consultar fuente',
    edit: 'Editar hito en GitHub',
    progress: 'Actualizar lectura en GitHub',
    library: '02 / BIBLIOTECA',
    libraryTitle: 'Otras formas de viajar.',
    libraryNote: 'Selección de muestra. Estos libros no se presentan como fuentes verificadas de las fechas del prototipo.',
    editBooks: 'Editar biblioteca en GitHub',
    result: 'hitos en esta vista',
    empty: 'No hay hitos en esta categoría.',
  },
  en: {
    eyebrow: 'A PERSONAL ATLAS OF TIME',
    heading: 'Everything has',
    emphasis: 'a history.',
    intro: 'From the first light to the ideas that changed the world. Explore the past, follow connections, and build your own library of time.',
    explore: 'Explore chapters',
    libraryLink: 'My library',
    chapter: '01 / EXPLORE',
    timeline: 'Take the long way.',
    scale: 'Chapter view · distances are not proportional to time',
    categories: { all: 'The whole journey', cosmos: 'The cosmos', humanity: 'Humankind', modern: 'The modern world' },
    unread: 'To read', reading: 'Reading', read: 'Read',
    detail: 'AT THIS MOMENT',
    source: 'View source',
    edit: 'Edit event on GitHub',
    progress: 'Update reading on GitHub',
    library: '02 / LIBRARY',
    libraryTitle: 'Other ways to travel.',
    libraryNote: 'Sample selection. These books are not presented as verified sources for this prototype’s dates.',
    editBooks: 'Edit library on GitHub',
    result: 'events in this view',
    empty: 'No events in this category.',
  },
};

export default function Atlas({ events, books, reading, editUrls, language }) {
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(events[0].id);
  const t = labels[language];
  const visible = events.filter((event) => category === 'all' || event.category === category);
  const selected = events.find((event) => event.id === selectedId);

  function filter(nextCategory) {
    setCategory(nextCategory);
    const next = events.filter((event) => nextCategory === 'all' || event.category === nextCategory);
    if (!next.some((event) => event.id === selectedId)) setSelectedId(next[0]?.id ?? null);
  }

  return (
    <>
      <section className="hero">
        <div className="orbit-art" aria-hidden="true"><i /><i /><i /><span /></div>
        <p className="eyebrow"><span className="live-dot" />{t.eyebrow}</p>
        <h1>{t.heading}<br /><em>{t.emphasis}</em></h1>
        <p className="hero-copy">{t.intro}</p>
        <div className="hero-actions">
          <a className="button primary" href="#explore">{t.explore} <span aria-hidden="true">↗</span></a>
          <a className="quiet-link" href="#library">{t.libraryLink} <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-caption"><span>13.8B</span><div /><span>{language === 'es' ? 'NUESTRO PRESENTE' : 'OUR PRESENT'}</span></div>
      </section>

      <section id="explore" className="exploration section">
        <div className="section-heading">
          <div><p className="eyebrow">{t.chapter}</p><h2>{t.timeline}</h2></div>
          <p className="scale-note">{t.scale}</p>
        </div>
        <div className="filters" role="group" aria-label={language === 'es' ? 'Filtrar capítulos' : 'Filter chapters'}>
          {Object.entries(t.categories).map(([key, label]) => (
            <button key={key} type="button" aria-pressed={category === key} onClick={() => filter(key)}>{label}</button>
          ))}
        </div>
        <p className="result-count" aria-live="polite">{visible.length} {t.result}</p>
        <div className="explorer-grid">
          <div className="timeline">
            {visible.map((event, index) => (
              <button
                type="button"
                className={`event-card ${selectedId === event.id ? 'selected' : ''}`}
                key={event.id}
                onClick={() => setSelectedId(event.id)}
                aria-pressed={selectedId === event.id}
                aria-controls="event-detail"
              >
                <span className="timeline-marker" aria-hidden="true" />
                <span className="event-top"><span className="event-date">{event.date[language]}</span><span className={`status ${reading.events[event.id]}`}>{t[reading.events[event.id]]}</span></span>
                <span className="event-title">{event.title[language]}</span>
                <span className="event-bottom">{t.categories[event.category]}<span aria-hidden="true">{String(index + 1).padStart(2, '0')} ↗</span></span>
              </button>
            ))}
            {!visible.length && <p>{t.empty}</p>}
          </div>
          {selected && (
            <aside id="event-detail" className="detail-panel" aria-labelledby="detail-title">
              <div key={selected.id} className="detail-content">
                <div className={`detail-illustration ${selected.category}`} aria-hidden="true"><span>✦</span></div>
                <p className="eyebrow">{t.detail}</p>
                <p className="detail-date">{selected.date[language]}</p>
                <h3 id="detail-title">{selected.title[language]}</h3>
                <p className="detail-summary">{selected.summary[language]}</p>
                <a className="source-link" href={selected.source.url} target="_blank" rel="noreferrer">{t.source} ↗<small>{selected.source.name}</small></a>
                <div className="detail-actions">
                  <a className="button" href={editUrls.events}>{t.edit} ↗</a>
                  <a className="quiet-link" href={editUrls.reading}>{t.progress} ↗</a>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>

      <section id="library" className="section library">
        <div className="section-heading">
          <div><p className="eyebrow">{t.library}</p><h2>{t.libraryTitle}</h2></div>
          <a className="quiet-link" href={editUrls.books}>{t.editBooks} ↗</a>
        </div>
        <p className="library-note">{t.libraryNote}</p>
        <div className="books">
          {books.map((book, index) => (
            <article className="book" key={book.id}>
              <div className={`book-cover cover-${index % 2}`} aria-hidden="true"><span>{book.author}</span><strong>{book.title}</strong><i>✦</i><small>{book.year}</small></div>
              <div className="book-info">
                <span className={`status ${reading.books[book.id]}`}>{t[reading.books[book.id]]}</span>
                <h3>{book.title}</h3><p className="book-author">{book.author} · {book.year}</p>
                <p>{book.description[language]}</p>
                <a className="quiet-link" href={editUrls.reading}>{t.progress} ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
