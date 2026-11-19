import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseDocument } from 'yaml';

const repository = 'https://github.com/ricardoguque/history';
const editableFiles = new Set([
  'data/events.yaml',
  'data/books.yaml',
  'data/reading.yaml',
]);

export function githubEditUrl(file) {
  if (!editableFiles.has(file)) {
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
        if (!['cosmos', 'humanity', 'modern'].includes(record.category)) {
          throw new Error(`Invalid event category: ${record.id}`);
        }
        for (const field of ['title', 'summary', 'date']) {
          requireTranslations(record[field], `${record.id}.${field}`);
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
}

export async function loadCatalog() {
  const entries = await Promise.all(['events', 'books', 'reading'].map(async (name) => {
    const filename = `data/${name}.yaml`;
    const text = await readFile(resolve(process.cwd(), filename), 'utf8');
    return [name, parseYaml(text, filename)];
  }));
  const files = Object.fromEntries(entries);
  const catalog = {
    events: files.events?.events,
    books: files.books?.books,
    reading: files.reading,
  };
  validateCatalog(catalog);
  return catalog;
}
