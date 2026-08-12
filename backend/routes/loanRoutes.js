const express = require("express");

const {
    getLoans,
    createLoan,
    returnLoan,
    deleteLoan
} = require("../controllers/loanController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getLoans);
router.post("/", protect, createLoan);
router.put("/:id/return", protect, returnLoan);
router.delete("/:id", protect, deleteLoan);

module.exports = router;