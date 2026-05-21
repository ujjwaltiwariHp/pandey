const Item = require("../models/Item");
const List = require("../models/List");

const getItemsByListId = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) return res.status(404).json({ error: "List not found." });

    const items = await Item.findByListId(req.params.listId);
    res.json({ items });
  } catch (err) {
    console.error("Get items error:", err);
    res.status(500).json({ error: "Failed to fetch items." });
  }
};

const createItem = async (req, res) => {
  try {
    const { item_values, highlight } = req.body;
    const listId = req.params.listId;

    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ error: "List not found." });

    if (!item_values || !Array.isArray(item_values)) {
      return res.status(400).json({ error: "item_values must be an array." });
    }

    const sort_order = await Item.getNextSortOrder(listId);
    const item = await Item.create({ list_id: listId, item_values, highlight, sort_order });
    res.status(201).json({ item });
  } catch (err) {
    console.error("Create item error:", err);
    res.status(500).json({ error: "Failed to create item." });
  }
};

const updateItem = async (req, res) => {
  try {
    const { item_values, highlight, sort_order } = req.body;
    const item = await Item.update(req.params.id, { item_values, highlight, sort_order });
    if (!item) return res.status(404).json({ error: "Item not found." });
    res.json({ item });
  } catch (err) {
    console.error("Update item error:", err);
    res.status(500).json({ error: "Failed to update item." });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.delete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });
    res.json({ message: "Item deleted successfully." });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ error: "Failed to delete item." });
  }
};

module.exports = { getItemsByListId, createItem, updateItem, deleteItem };
