const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const dotenv = require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const book = require("./models/book");

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`connected to MongoDB ${mongoose.connection.name} 🥭`);
});

app.get("/", async (req, res) => {
  res.render("home.ejs");
});

app.get("/books/new", async (req, res) => {
  res.render("new.ejs");
});

app.post("/books", async (req, res) => {
  const bookData = {};
  bookData.name = req.body.name;
  bookData.totalPages = req.body.totalPages;

  if (req.body.LikeIt === "on") {
    bookData.LikeIt = true;
  } else {
    bookData.LikeIt = false;
  }

  bookData.status = req.body.status;

  let createdBook = await book.create(bookData);
  res.redirect("/");
});


app.listen(3000, () => {
  console.log("Listening on port 3000 📚");
});
