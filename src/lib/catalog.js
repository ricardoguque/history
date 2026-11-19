import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseDocument } from 'yaml';
import { categories, eventBounds } from './timeline.js';

const repository = 'https://github.com/ricardoguque/history';
const editableFiles = new Set([
  'data/catalog.yaml',
  'data/books.yaml',
  'data/reading.yaml',
]);

export function githubEditUrl(file) {
  if (!editableFiles.has(file) && !/^data\/events\/[a-z][a-z0-9-]*\.yaml$/.test(file)) {
    throw new Error(`Unknown editable file: ${file}`);
  }
  return `${repository}/edit/main/${file}`;
}

export function parseYaml(text, filename) {
  const document = parseDocument(text, { uniqueKeys: true });
  if (document.errors.length) {
    throw new Error(`${filename}: ${document.errors.map((error) => error.message).join('; ')}`);
  }
  return document.toJS();
}

function requireText(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing or invalid text: ${field}`);
  }
}

function requireTranslations(value, field) {
  for (const language of ['es', 'en']) {
    requireText(value?.[language], `${field}.${language}`);
  }
}

export function validateCatalog({ events, books, reading }) {
  for (const [collection, records] of Object.entries({ events, books })) {
    if (!Array.isArray(records) || !records.length) {
      throw new Error(`${collection} must be a non-empty list`);
    }
    const ids = new Set();
    for (const record of records) {
      requireText(record?.id, `${collection}.id`);
      if (ids.has(record.id)) throw new Error(`Duplicate ${collection} id: ${record.id}`);
      ids.add(record.id);
      if (collection === 'events') {
        if (!categories.includes(record.category)) {
          throw new Error(`Invalid event category: ${record.id}`);
        }
        for (const field of ['title', 'summary', 'date']) {
          requireTranslations(record[field], `${record.id}.${field}`);
        }
        requireTranslations(record.location, `${record.id}.location`);
        eventBounds(record);
        if (!Array.isArray(record.books) || new Set(record.books).size !== record.books.length) {
          throw new Error(`Invalid book recommendations: ${record.id}`);
        }
        requireText(record.source?.name, `${record.id}.source.name`);
        requireText(record.source?.url, `${record.id}.source.url`);
        if (new URL(record.source.url).protocol !== 'https:') {
          throw new Error(`Source must use HTTPS: ${record.id}`);
        }
      } else {
        requireText(record.title, `${record.id}.title`);
        requireText(record.author, `${record.id}.author`);
        if (!Number.isInteger(record.year)) throw new Error(`Invalid book year: ${record.id}`);
        requireTranslations(record.description, `${record.id}.description`);
      }
    }
    const states = reading?.[collection];
    if (!states || typeof states !== 'object' || Array.isArray(states)) {
      throw new Error(`Missing reading states: ${collection}`);
    }
    for (const id of ids) {
      const allowed = collection === 'books' ? ['unread', 'reading', 'read'] : ['unread', 'read'];
      if (!allowed.includes(states[id])) throw new Error(`Invalid reading state: ${collection}.${id}`);
    }
    for (const id of Object.keys(states)) {
      if (!ids.has(id)) throw new Error(`Unknown reading reference: ${collection}.${id}`);
    }
  }
  const bookIds = new Set(books.map((book) => book.id));
  for (const event of events) {
    for (const id of event.books) {
      if (!bookIds.has(id)) throw new Error(`Unknown book recommendation: ${event.id}.${id}`);
    }
  }
}

export function validateManifest(manifest) {
  if (manifest?.schema_version !== 1 || !Array.isArray(manifest.event_files)
    || !manifest.event_files.length || new Set(manifest.event_files).size !== manifest.event_files.length
    || !manifest.event_files.every((file) => typeof file === 'string' && /^data\/events\/[a-z][a-z0-9-]*\.yaml$/.test(file))) {
    throw new Error('Invalid event file manifest: data/catalog.yaml');
  }
}

async function loadYaml(filename) {
  const text = await readFile(resolve(process.cwd(), ...filename.split('/')), 'utf8');
  return parseYaml(text, filename);
}

export async function loadCatalog() {
  const manifest = await loadYaml('data/catalog.yaml');
  validateManifest(manifest);
  const [bookFile, reading, ...eventFiles] = await Promise.all([
    loadYaml('data/books.yaml'),
    loadYaml('data/reading.yaml'),
    ...manifest.event_files.map(loadYaml),
  ]);
  const events = eventFiles.flatMap((file, index) => {
    const filename = manifest.event_files[index];
    if (!Array.isArray(file?.events) || !file.events.length) {
      throw new Error(`Missing events in ${filename}`);
    }
    return file.events.map((event) => ({ ...event, dataFile: filename }));
  });
  const catalog = {
    events,
    books: bookFile?.books,
    reading,
  };
  validateCatalog(catalog);
  catalog.events.sort((a, b) => eventBounds(a)[0] - eventBounds(b)[0]);
  return catalog;
}
