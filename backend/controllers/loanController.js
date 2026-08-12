const Loan = require("../models/Loan");
const Book = require("../models/Book");
const Member = require("../models/Member");

const getLoans = async (req, res, next) => {
    try {
        const loans = await Loan.find()
            .populate("member", "name email memberCode")
            .populate("book", "title author isbn")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: loans
        });
    } catch (error) {
        next(error);
    }
};

const createLoan = async (req, res, next) => {
    try {
        const {
            member,
            book,
            loanDate,
            dueDate
        } = req.body;

if (!member || !book || !loanDate || !dueDate) {
    return res.status(400).json({
        success: false,
        message: "Member, buku, tanggal peminjaman, dan tanggal jatuh tempo wajib diisi."
    });
}

        const memberData = await Member.findById(member);
        const bookData = await Book.findById(book);

        if (!memberData) {
            return res.status(404).json({
                success: false,
                message: "Member tidak ditemukan."
            });
        }

        if (!bookData) {
            return res.status(404).json({
                success: false,
                message: "Buku tidak ditemukan."
            });
        }

        if (bookData.stock <= 0) {
            return res.status(400).json({
                success: false,
                message: "Stok buku habis."
            });
        }

        const activeLoan = await Loan.findOne({
            member,
            book,
            status: "borrowed"
        });

        if (activeLoan) {
            return res.status(409).json({
                success: false,
                message: "Member masih memiliki peminjaman aktif untuk buku ini."
            });
        }

        const loan = await Loan.create({
            member,
            book,
            loanDate,
            dueDate
        });

        bookData.stock -= 1;
        await bookData.save();

        const result = await Loan.findById(loan._id)
            .populate("member", "name email memberCode")
            .populate("book", "title author isbn");

        res.status(201).json({
            success: true,
            message: "Peminjaman berhasil dibuat.",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const returnLoan = async (req, res, next) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Data peminjaman tidak ditemukan."
            });
        }

        if (loan.status === "returned") {
            return res.status(400).json({
                success: false,
                message: "Buku sudah dikembalikan."
            });
        }

        const book = await Book.findById(loan.book);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Buku tidak ditemukan."
            });
        }

        loan.status = "returned";
        loan.returnDate = new Date();

        await loan.save();

        book.stock += 1;
        await book.save();

        const result = await Loan.findById(loan._id)
            .populate("member", "name email memberCode")
            .populate("book", "title author isbn");

        res.status(200).json({
            success: true,
            message: "Buku berhasil dikembalikan.",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const deleteLoan = async (req, res, next) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Data peminjaman tidak ditemukan."
            });
        }

        if (loan.status === "borrowed") {
            const book = await Book.findById(loan.book);

            if (book) {
                book.stock += 1;
                await book.save();
            }
        }

        await loan.deleteOne();

        res.status(200).json({
            success: true,
            message: "Data peminjaman berhasil dihapus."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLoans,
    createLoan,
    returnLoan,
    deleteLoan
};