const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("../routes/authRoutes");
const bookRoutes = require("../routes/bookRoutes");
const memberRoutes = require("../routes/memberRoutes");
const loanRoutes = require("../routes/loanRoutes");
const dashboardRoutes = require("../routes/dashboardRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Secure UNSIA Digital Library API berjalan"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/dashboard", dashboardRoutes);

// pasang 404 Not Found Handler 
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route tidak ditemukan."
    });
});

// pasang Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: "Terjadi kesalahan pada server."
    });
});

module.exports = app;