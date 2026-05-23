const express = require("express");
const router = express.Router();
const { getItemsByListId, createItem, updateItem, deleteItem, reorderItems } = require("../controllers/itemController");
const auth = require("../middleware/auth");

router.get("/lists/:listId/items", getItemsByListId);
router.post("/lists/:listId/items", auth, createItem);
router.put("/items/:id", auth, updateItem);
router.delete("/items/:id", auth, deleteItem);
router.put("/lists/:listId/items/reorder", auth, reorderItems);

module.exports = router;

