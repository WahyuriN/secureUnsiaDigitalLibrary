const Member = require("../models/Member");

const getMembers = async (req, res, next) => {
    try {
        const members = await Member.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: members
        });
    } catch (error) {
        next(error);
    }
};

const createMember = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            memberCode
        } = req.body;

        if (!name || !email || !memberCode) {
            return res.status(400).json({
                success: false,
                message: "Nama, email, dan kode anggota wajib diisi."
            });
        }

        const existingMember = await Member.findOne({
            $or: [{ email }, { memberCode }]
        });

        if (existingMember) {
            return res.status(409).json({
                success: false,
                message: "Email atau kode anggota sudah terdaftar."
            });
        }

        const member = await Member.create({
            name,
            email,
            phone,
            address,
            memberCode
        });

        res.status(201).json({
            success: true,
            message: "Member berhasil ditambahkan.",
            data: member
        });
    } catch (error) {
        next(error);
    }
};

const updateMember = async (req, res, next) => {
    try {
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member tidak ditemukan."
            });
        }

        res.status(200).json({
            success: true,
            message: "Member berhasil diperbarui.",
            data: member
        });
    } catch (error) {
        next(error);
    }
};

const deleteMember = async (req, res, next) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member tidak ditemukan."
            });
        }

        res.status(200).json({
            success: true,
            message: "Member berhasil dihapus."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMembers,
    createMember,
    updateMember,
    deleteMember
};