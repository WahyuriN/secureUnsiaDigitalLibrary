const Book = require("../models/book");
const Member = require("../models/member");
const Loan = require("../models/loan");

const getDashboard = async (req, res, next) => {
    try {
        const totalBooks = await Book.countDocuments();

        const availableBooksResult = await Book.aggregate([
    {
        $group: {
            _id: null,
            total: {
                $sum: "$stock"
            }
        }
    }
]);

const totalAvailableBooks =
    availableBooksResult[0]?.total || 0;

        const totalMembers = await Member.countDocuments();

        const totalLoans = await Loan.countDocuments();

        const activeLoans = await Loan.countDocuments({
            status: "borrowed"
        });

        const returnedLoans = await Loan.countDocuments({
            status: "returned"
        });

        const booksByCategory = await Book.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    total: -1
                }
            }
        ]);

        const loansByMonth = await Loan.aggregate([
    {
        $group: {
            _id: {
                year: { $year: "$loanDate" },
                month: { $month: "$loanDate" }
            },
            total: {
                $sum: 1
            }
        }
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1
        }
    }
]);

        res.status(200).json({
            success: true,
            data: {
                totalBooks,
                totalAvailableBooks,
                totalMembers,
                totalLoans,
                activeLoans,
                returnedLoans,
                booksByCategory,
                loansByMonth
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard
};