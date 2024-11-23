const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.parse(JSON.stringify(books, null, 4)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn
  let data = null
  try {
    data = books[isbn]
  } catch (error) {
    res.status(400).json({ error: error.toString() })
  }
  res.send(data)
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author
  let data = []
  try {
    Object.keys(books).forEach(key => {
      if (books[key].author === author) {
        data.push(books[key])
      }
    })
  } catch (error) {
    res.status(400).json({ error: error.toString() })
  }
  res.send(data)
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title
  let data = []
  try {
    Object.keys(books).forEach(key => {
      if (books[key].title === title) {
        data.push(books[key])
      }
    })
  } catch (error) {
    res.status(400).json({ error: error.toString() })
  }
  res.send(data)
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  let data = null
  try {
    data = books[isbn].reviews
  } catch (error) {
    res.status(400).json({ error: error.toString() })
  }
  res.status(200).json({ reviews: data })
});

module.exports.general = public_users;
