const Book = require("../models/book");

const getBooks = async (req, res, next) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        next(error);
    }
};

const createBook = async (req, res, next) => {
    try {
        const {
            title,
            author,
            category,
            isbn,
            year,
            stock
        } = req.body;

        if (
            !title ||
            !author ||
            !category ||
            !isbn ||
            year === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Semua data buku wajib diisi."
            });
        }

        const existingBook = await Book.findOne({ isbn });

        if (existingBook) {
            return res.status(409).json({
                success: false,
                message: "ISBN sudah terdaftar."
            });
        }

        const book = await Book.create({
            title,
            author,
            category,
            isbn,
            year,
            stock
        });

        res.status(201).json({
            success: true,
            message: "Buku berhasil ditambahkan.",
            data: book
        });
    } catch (error) {
        next(error);
    }
};

const updateBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Buku tidak ditemukan."
            });
        }

        res.status(200).json({
            success: true,
            message: "Buku berhasil diperbarui.",
            data: book
        });
    } catch (error) {
        next(error);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Buku tidak ditemukan."
            });
        }

        res.status(200).json({
            success: true,
            message: "Buku berhasil dihapus."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook
};