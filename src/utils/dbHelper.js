import initSqlJs from "sql.js";
import { get, set } from "idb-keyval";

let SQL = null;
let db = null;

const DB_KEY = "dictionary.sqlite";

export async function initDb() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`,
    });
  }

  let dbFile = await get(DB_KEY);
  let isNewDb = false;

  if (!dbFile) {
    // Create a new database if none exists
    db = new SQL.Database();
    isNewDb = true;
  } else {
    db = new SQL.Database(dbFile);
  }

  // Drop and recreate products table to ensure proper structure
  db.run('DROP TABLE IF EXISTS products');
  
  // Create products table with all required columns
  db.run(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      image_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Products table created with columns: id, name, description, image_path, created_at');

  // Save the database after table creation
  if (isNewDb) {
    const data = db.export();
    await set(DB_KEY, data);
  }

  return db;
}

export function getDb() {
  return db;
}

export async function saveDb() {
  if (!db) return;
  const data = db.export();
  await set(DB_KEY, data);
}
