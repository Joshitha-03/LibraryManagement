const User=require("../models/user");
const express = require("express");
const bcrypt = require("bcryptjs");
const {setUser} =require("../service/auth");

const router=express.Router(); 


router.post("/userSignIn", async function signIn(req,res) {
    const { name, userId, email, phone, password } =req.body;
    await User.create({
        name,
        userId,
        email, 
        phone, 
        password
      });
      return res.send("sing in sucessfull");
});

router.post("/userLogin", async function logIn(req, res) {
    const { userId, email, password } = req.body;
  const user = await User.findOne({ userId, email, password });

  if (!user)
    return res.render("login", {
      error: "Invalid Username or Password",
    });

  const token=setUser(user);
  res.cookie("uid", token);
  return res.send("login in sucessfull");
})

module.exports=router;