const book=require("../models/Book");
const express = require("express");

const router=express.Router(); 


router.post("/add", async function addBook(req,res) {
    const { bookId,
        image,
        title,
        author,
        quantity,
        price,
        description,
        rating,
        isAvailable} =req.body;
    await book.create({
        bookId,
        image,
        title,
        author,
        quantity,
        price,
        description,
        rating,
        isAvailable
      });
      return res.send("Book inserted");
});

module.exports=router;