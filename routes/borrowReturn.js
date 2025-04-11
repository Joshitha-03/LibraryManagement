const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Book = require('../models/Book');
const Transaction=require("../models/transaction");

router.post("/issueBook", async (req, res) => {
  const { userId, bookId } = req.body;

  const user = await User.findOne({ userId });
  if (!user) return res.status(404).json({ message: "User not found" });

  const book = await Book.findOne({ bookId });
  if (!book || book.quantity <= 0) {
    return res.status(400).json({ message: "Book not available" });
  }

  const issuedCount = await Transaction.countDocuments({ userId, type: "ISSUE" });
  if (issuedCount >= 5) {
    return res.status(400).json({ message: "User has reached issue limit" });
  }

  await Book.updateOne({ bookId }, { $inc: { quantity: -1 } });
  await Transaction.create({
    userId,
    bookId,
    bookTitle: book.title,
    type: "ISSUE",
    issueDate: new Date()
  });

  await User.updateOne(
    { userId },
    { $push: { borrowedBooks: book._id } }
  );

  res.json({ message: "Book issued successfully" });
});

router.post("/returnBook", async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const book = await Book.findOne({ bookId });
    if (!book) return res.status(404).json({ message: "Book not found" });

    const issuedTransaction = await Transaction.findOne({
      userId,
      bookId,
      type: "ISSUE"
    }).sort({ issueDate: -1 });

    if (!issuedTransaction) {
      return res.status(400).json({ message: "No issued record found for this book by this user" });
    }

    await Book.updateOne({ bookId }, { $inc: { quantity: 1 } });

    await Transaction.create({
      userId,
      bookId,
      bookTitle: book.title,
      type: "RETURN",
      issueDate: issuedTransaction.issueDate,
      returnDate: new Date()
    });

    await User.updateOne(
      { userId },
      { $pull: { borrowedBooks: book._id } }
    );

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    console.error("Error in returnBook:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/search",async (req, res) => {
    const title = req.query.title || '';
    try {
      const books = await Book.find({
        title: { $regex: title, $options: 'i' }
      });
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
