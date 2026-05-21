const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lists (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        columns JSONB NOT NULL DEFAULT '[]',
        highlights JSONB NOT NULL DEFAULT '{}',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        list_id INT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
        item_values JSONB NOT NULL DEFAULT '[]',
        highlight VARCHAR(20) DEFAULT 'none',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Database tables initialized");
  } catch (err) {
    console.error("❌ Database init error:", err.message);
  } finally {
    client.release();
  }
};

module.exports = { pool, initDB };
