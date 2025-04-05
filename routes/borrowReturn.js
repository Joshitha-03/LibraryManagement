const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Book = require('../models/Book');

router.post('/borrow', async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    const book = await Book.findOne({bookId});
    const user = await User.findOne({userId});

    if (!book || book.quantity<=0 ) {
      return res.status(400).json({ message: 'Book is not available.' });
    }

    // book.isAvailable = false;
    book.quantity-=1;
    user.borrowedBooks.push(book._id);

    await book.save();
    await user.save();

    res.json({ message: 'Book borrowed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/return', async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    const user = await User.findOne({userId});
    const book = await Book.findOne({bookId});

    if (!user || !book) {
      return res.status(404).json({ message: 'User or Book not found.' });
    }

    if (!user.borrowedBooks.includes(bookId)) {
      return res.status(400).json({ message: 'User did not borrow this book.' });
    }

    user.borrowedBooks = user.borrowedBooks.filter(id => id.toString() !== bookId);
    // book.isAvailable = true;
    book.quantit+=1;

    await user.save();
    await book.save();

    res.json({ message: 'Book returned successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
