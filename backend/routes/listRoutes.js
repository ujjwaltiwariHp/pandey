const express = require("express");
const router = express.Router();
const { getAllLists, getListById, createList, updateList, deleteList } = require("../controllers/listController");
const auth = require("../middleware/auth");

router.get("/", getAllLists);
router.get("/:id", getListById);
router.post("/", auth, createList);
router.put("/:id", auth, updateList);
router.delete("/:id", auth, deleteList);

module.exports = router;
