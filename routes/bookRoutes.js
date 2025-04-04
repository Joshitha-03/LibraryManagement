const express = require("express");
const Book = require("../models/Book");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Add Book Route
router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { title, author, quantity, price, description, rating } = req.body;
        const newBook = new Book({
            image: req.file ? `/uploads/${req.file.filename}` : "",
            title,
            author,
            quantity,
            price,
            description,
            rating
        });

        await newBook.save();
        res.json({ message: "Book added successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add book" });
    }
});

router.delete('/deletebook', async (req, res) => {
    const { title } = req.body;  // Get title from the body
  
    try {
      const book = await Book.findOneAndDelete({ title });  // Delete the book by title
      if (book) {
        res.status(200).json({ message: 'Book deleted successfully' });
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error deleting book' });
    }
  });

// Update book by ID (with image optional)
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
      const bookId = req.params.id;
      const updates = {};

      // Check each field and only add non-empty values to the update object
      if (req.body.title) updates.title = req.body.title;
      if (req.body.author) updates.author = req.body.author;
      if (req.body.quantity) updates.quantity = req.body.quantity;
      if (req.body.price) updates.price = req.body.price;
      if (req.body.description) updates.description = req.body.description;
      if (req.body.rating) updates.rating = req.body.rating;
      if (req.file) updates.image = `/uploads/${req.file.filename}`;

      // Ensure at least one field is being updated
      if (Object.keys(updates).length === 0) {
          return res.status(400).json({ message: "No valid fields to update" });
      }

      // Update the book
      const updatedBook = await Book.findByIdAndUpdate(bookId, updates, { new: true });

      if (!updatedBook) {
          return res.status(404).json({ message: "Book not found" });
      }

      res.json({ message: "Book updated successfully!", updatedBook });
  } catch (error) {
      res.status(500).json({ error: "Failed to update book" });
  }
});

    

// Get All Books Route
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clears JWT from cookies
  res.json({ message: "Logout successful" });
});

router.get('/api/books/count', async (req, res) => {
    try {
      const count = await books.countDocuments(); // Count the number of books
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book count' });
    }
  });

module.exports = router;
