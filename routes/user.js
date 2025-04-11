const User = require("../models/user");
const express = require("express");
const bcrypt = require("bcryptjs");
const { setUser } = require("../service/auth");
const { getUser } = require("../service/auth");
const Transaction = require("../models/transaction");
const authenticate = require("../middleware/authenticate");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const transaction = require("../models/transaction");

// configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "profile-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// update route
router.post("/userSignIn", upload.single("profileImage"), async (req, res) => {
  const { name, userId, email, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const profileImage = req.file ? req.file.filename : "default.png";

  await User.create({
    name,
    userId,
    email,
    phone,
    password: hashedPassword,
    profileImage,
  });

  return res.json({ message: "Sign up successful!" });
});

// router.post("/userSignIn", async function signIn(req,res) {
//     const { name, userId, email, phone, password } =req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({
//         name,
//         userId,
//         email,
//         phone,
//         password: hashedPassword,
//       });
//       return res.send("sing in sucessfull");
// });

router.post("/userLogin", async function logIn(req, res) {
  const { userId, email, password } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user || user.email !== email) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    const token = setUser(user);

    res.cookie("uid", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false, // true if using HTTPS
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const userData = getUser(token);

  if (!userData) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const user = await User.findById(userData._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// userLogout route
router.post("/userLogout", function logOut(req, res) {
  res.clearCookie("uid"); // Clear the uid cookie
  return res.status(200).json({ message: "Logout successful" });
});

router.get("/", authenticate, async (req, res) => {
  console.log("User ID:", req.user._id); // Ensure correct user ID
  console.log(req.user);

  try {
    const userEmail = req.user.email;
    const transactions = await Transaction.find();
    const users = await User.findOne({ email: userEmail });
    const currentUserId = users.userId;

    const userTransactions = transactions.filter(
      (transaction) => transaction.userId == currentUserId
    );
    console.log("Fetched Transactions:", userTransactions);
    res.status(200).json({ success: true, data: userTransactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/user/count - returns total number of users registered
router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/borrowedBooks", authenticate, async (req, res) => {
  const users = await User.findOne({ _id: req.user._id });
  const userId = users.userId;
  try {
    const user = await User.findOne({ userId }).populate("borrowedBooks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const borrowedBook = res.json({ borrowedBooks: user.borrowedBooks });
    console.log(borrowedBook);
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    res.status(500).json({ message: "Failed to fetch borrowed books" });
  }
});

module.exports = router;
