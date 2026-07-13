const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const dotenv = require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const book = require("./models/book");

const app = express();

app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`connected to MongoDB ${mongoose.connection.name} 🥭`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'))
app.use(morgan('dev'))

// homepage
app.get("/", async (req, res) => {
  res.render("home.ejs");
});

// show the form for creating book
app.get("/books/new", async (req, res) => {
  res.render("new.ejs");
});

// create the book in the database
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
  res.redirect('/books');
});

// show all the books - index
app.get("/books", async (req, res) => {
  let allBooks = await book.find();
  console.log(allBooks)
  res.render("index.ejs", {
    allBooks,
  });
});

// show the book
app.get('/books/:bookId', async (req,res)=>{
  let foundBook = await book.findById(req.params.bookId)
 console.log(foundBook)
 res.render('show.ejs', {
  foundBook,
 })
})

// delete the book
app.delete("/books/:bookId", async (req, res) => {
  await book.findByIdAndDelete(req.params.bookId);
  res.redirect("/book");
});

app.get("/books/:bookId/edit", async (req, res) => {
  let foundBook = await book.findById(req.params.bookId);
  console.log(foundBook);
  res.render("edit.ejs", {
    foundBook,
  });
});

// PUT - updates the fruit in the database 
app.put('/books/:bookId',async (req,res)=>{
    const bookData = {}
    bookData.name = req.body.name
    bookData.totalPages = req.body.totalPages
    
    if (req.body.likeIt === "on") {
        bookData.likeIt = true;
    } else {
        bookData.likeIt = false;
    }

    bookData.status = req.body.status
    let updatedBook = await book.findByIdAndUpdate(req.params.bookId ,bookData, {new: true})

res.redirect(`/book/${req.params.bookId}`)
})

app.listen(3000, () => {
  console.log("Listening on port 3000 📚");
});
