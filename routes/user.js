const User=require("../models/user");
const express = require("express");
const bcrypt = require("bcryptjs");
const {setUser} =require("../service/auth");
const { getUser } = require("../service/auth");
const Transaction=require("../models/transaction");
const authenticate = require('../middleware/authenticate');
const router=express.Router(); 

router.post("/userSignIn", async function signIn(req,res) {
    const { name, userId, email, phone, password } =req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name,
        userId,
        email, 
        phone, 
        password: hashedPassword,
      });
      return res.send("sing in sucessfull");
});

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

router.get('/', authenticate, async (req, res) => {
  console.log('User ID:', req.user._id); // Ensure correct user ID
  try {
      const transactions = await Transaction.find({ userId: req.user._id.toString() }); // Make sure to convert the user ID to string
      console.log('Fetched Transactions:', transactions);
      res.status(200).json({ success: true, data: transactions });
  } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});




// GET /api/user/count - returns total number of users registered
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports=router;