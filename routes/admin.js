const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");

const {setUser} =require("../service/auth");

const router = express.Router();

// Admin Login

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, { httpOnly: true }).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


// Admin Dashboard (Protected Route)
router.get("/dashboard", auth, (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard", adminId: req.admin.id });
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token").json({ message: "Logged out successfully" });
});

module.exports = router;
