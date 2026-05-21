const { pool } = require("../config/db");

const Admin = {
  findByUsername: async (username) => {
    const result = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);
    return result.rows[0] || null;
  },

  create: async (username, passwordHash) => {
    const result = await pool.query(
      "INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING *",
      [username, passwordHash]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query("SELECT id, username, created_at FROM admins WHERE id = $1", [id]);
    return result.rows[0] || null;
  },
};

module.exports = Admin;
