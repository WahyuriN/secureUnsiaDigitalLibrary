const express = require("express");

const {
    getBooks,
    createBook,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getBooks);
router.post("/", protect, createBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;