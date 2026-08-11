import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data", "db.json");

const COLLECTIONS = [
  "budgets",
  "networth",
  "goals",
  "investments",
  "properties",
  "loanChecks",
  "tvmHistory",
  "profile",
];

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    const empty = { users: {} };
    COLLECTIONS.forEach((c) => (empty[c] = {}));
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2), "utf-8");
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    const empty = { users: {} };
    COLLECTIONS.forEach((c) => (empty[c] = {}));
    return empty;
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function ensureUser(userId, name = "") {
  const db = readDb();
  if (!db.users[userId]) {
    db.users[userId] = { id: userId, name, createdAt: new Date().toISOString() };
    writeDb(db);
  }
  return db.users[userId];
}

export function getCollection(userId, collection) {
  const db = readDb();
  return db[collection]?.[userId] || [];
}

export function addItem(userId, collection, item) {
  const db = readDb();
  if (!db[collection]) db[collection] = {};
  if (!db[collection][userId]) db[collection][userId] = [];
  db[collection][userId].unshift(item);
  writeDb(db);
  return item;
}

export function deleteItem(userId, collection, itemId) {
  const db = readDb();
  if (!db[collection]?.[userId]) return false;
  db[collection][userId] = db[collection][userId].filter((i) => i.id !== itemId);
  writeDb(db);
  return true;
}

export function replaceLatest(userId, collection, item, keep = 1) {
  // keeps only the most recent `keep` snapshots (used for budget/net worth)
  const db = readDb();
  if (!db[collection]) db[collection] = {};
  if (!db[collection][userId]) db[collection][userId] = [];
  db[collection][userId].unshift(item);
  db[collection][userId] = db[collection][userId].slice(0, keep);
  writeDb(db);
  return item;
}
