const { pool } = require("../config/db");

const List = {
  findAll: async () => {
    const result = await pool.query("SELECT * FROM lists ORDER BY sort_order ASC, id ASC");
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query("SELECT * FROM lists WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  create: async ({ title, columns, highlights, sort_order }) => {
    const result = await pool.query(
      `INSERT INTO lists (title, columns, highlights, sort_order) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, JSON.stringify(columns), JSON.stringify(highlights), sort_order || 0]
    );
    return result.rows[0];
  },

  update: async (id, { title, columns, highlights, sort_order }) => {
    const result = await pool.query(
      `UPDATE lists SET title = $1, columns = $2, highlights = $3, sort_order = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [title, JSON.stringify(columns), JSON.stringify(highlights), sort_order || 0, id]
    );
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await pool.query("DELETE FROM lists WHERE id = $1 RETURNING *", [id]);
    return result.rows[0] || null;
  },

  findAllWithItems: async () => {
    const lists = await pool.query("SELECT * FROM lists ORDER BY sort_order ASC, id ASC");
    const items = await pool.query("SELECT * FROM items ORDER BY sort_order ASC, id ASC");

    return lists.rows.map((list) => ({
      ...list,
      items: items.rows.filter((item) => item.list_id === list.id),
    }));
  },
};

module.exports = List;
