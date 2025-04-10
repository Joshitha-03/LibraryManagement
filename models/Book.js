const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true,
        unique: true
      }, 
    image: String,
    title: String,
    author: String,
    quantity: Number,
    price: Number,
    description: String,
    rating: Number,
    isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Book", bookSchema);
