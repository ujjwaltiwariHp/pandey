const { pool } = require("../config/db");

const Item = {
  findByListId: async (listId) => {
    const result = await pool.query(
      "SELECT * FROM items WHERE list_id = $1 ORDER BY sort_order ASC, id ASC",
      [listId]
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  create: async ({ list_id, item_values, highlight, sort_order }) => {
    const result = await pool.query(
      `INSERT INTO items (list_id, item_values, highlight, sort_order) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [list_id, JSON.stringify(item_values), highlight || "none", sort_order || 0]
    );
    return result.rows[0];
  },

  update: async (id, { item_values, highlight, sort_order }) => {
    const result = await pool.query(
      `UPDATE items SET item_values = $1, highlight = $2, sort_order = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [JSON.stringify(item_values), highlight || "none", sort_order || 0, id]
    );
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await pool.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
    return result.rows[0] || null;
  },

  getNextSortOrder: async (listId) => {
    const result = await pool.query(
      "SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM items WHERE list_id = $1",
      [listId]
    );
    return result.rows[0].next_order;
  },
};

module.exports = Item;
