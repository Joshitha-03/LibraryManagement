require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/admin");
const userRoutes=require("./routes/user");
const borrow = require("./routes/borrowReturn");
const addBook=require("./routes/addBook");
const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");
const bookRoutes = require("./routes/bookRoutes");
const connectDb=require("./connect");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static("public")); // Serve index.html

// Connect to MongoDB
connectDb("mongodb://localhost:27017/library").then(()=>console.log("connectd to database!"));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, "./public/uploads/index.html"));
// });


  app.post("/admin/login", async (req, res) => {
      console.log("Received login request:", req.body);  // Debugging log
  
      const { username, password } = req.body;
      if (!username || !password) {
          return res.status(400).json({ message: "Username and password are required" });
      }
  
      // Check database
      const admin = await Admin.findOne({ username });
      if (!admin) {
          return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
      }
  
      return res.status(200).json({ message: "Login successful!" });
  });
  
  

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/user", userRoutes);
app.use("/api/book",addBook);
app.use("/api/borrow",borrow);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
