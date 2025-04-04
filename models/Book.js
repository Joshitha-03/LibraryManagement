const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    image: String,
    title: String,
    author: String,
    quantity: Number,
    price: Number,
    description: String,
    rating: Number
});

module.exports = mongoose.model("Book", bookSchema);
