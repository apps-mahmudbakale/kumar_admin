import initSqlJs from "sql.js";
import { get, set } from "idb-keyval";
import bcrypt from 'bcryptjs';

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
  // db.run('DROP TABLE IF EXISTS products');
  
  // // Create products table with all required columns
  // db.run(`
  //   CREATE TABLE products (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     name TEXT NOT NULL,
  //     description TEXT NOT NULL,
  //     image_path TEXT,
  //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  //   )
  // `);
  
  // console.log('Products table created with columns: id, name, description, image_path, created_at');

  // // Create users table if it doesn't exist
  // db.run(`
  //   CREATE TABLE IF NOT EXISTS users (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     email TEXT UNIQUE NOT NULL,
  //     password TEXT NOT NULL,
  //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  //   )
  // `);

  // // Set default admin user
  // try {
  //   const salt = bcrypt.genSaltSync(10);
  //   const hashedPassword = bcrypt.hashSync('Kumar@2024', salt);
    
  //   // Delete any existing users and insert the default admin
  //   db.run('DELETE FROM users');
  //   db.run(
  //     'INSERT INTO users (email, password) VALUES (?, ?)',
  //     ['info@kumaragroengineering.com', hashedPassword]
  //   );
  //   console.log('Default admin user created');
  // } catch (error) {
  //   console.error('Error creating default user:', error);
  // }

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
