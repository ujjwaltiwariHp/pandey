const List = require("../models/List");

const getAllLists = async (req, res) => {
  try {
    const lists = await List.findAllWithItems();
    res.json({ lists });
  } catch (err) {
    console.error("Get lists error:", err);
    res.status(500).json({ error: "Failed to fetch lists." });
  }
};

const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: "List not found." });
    res.json({ list });
  } catch (err) {
    console.error("Get list error:", err);
    res.status(500).json({ error: "Failed to fetch list." });
  }
};

const createList = async (req, res) => {
  try {
    const { title, columns, highlights, sort_order } = req.body;
    if (!title || !columns || columns.length < 1) {
      return res.status(400).json({ error: "Title and at least one column are required." });
    }
    const list = await List.create({ title, columns, highlights: highlights || {}, sort_order });
    res.status(201).json({ list });
  } catch (err) {
    console.error("Create list error:", err);
    res.status(500).json({ error: "Failed to create list." });
  }
};

const updateList = async (req, res) => {
  try {
    const { title, columns, highlights, sort_order } = req.body;
    const list = await List.update(req.params.id, { title, columns, highlights, sort_order });
    if (!list) return res.status(404).json({ error: "List not found." });
    res.json({ list });
  } catch (err) {
    console.error("Update list error:", err);
    res.status(500).json({ error: "Failed to update list." });
  }
};

const deleteList = async (req, res) => {
  try {
    const list = await List.delete(req.params.id);
    if (!list) return res.status(404).json({ error: "List not found." });
    res.json({ message: "List deleted successfully." });
  } catch (err) {
    console.error("Delete list error:", err);
    res.status(500).json({ error: "Failed to delete list." });
  }
};

module.exports = { getAllLists, getListById, createList, updateList, deleteList };
