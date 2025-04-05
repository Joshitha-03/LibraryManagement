
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        userId:{
            type:String,
            required:true,
            unique: true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        phone:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;