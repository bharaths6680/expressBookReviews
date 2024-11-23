const express = require('express');
let books = require("./booksdb.js");
const  axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(201).json({ message: "User registered successfully" });
    }
    throw new Error("Username already exists");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.parse(JSON.stringify(books, null, 4)));
});

public_users.get('/fetch-books-axios', async function (req, res) {
  try {
    const response = await axios.get('https://bharaths-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'); // Replace 'URL_TO_GET_BOOKS' with the actual URL to fetch books
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
});

public_users.get('/get-promissed-books', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  }).then(bookList => res.status(200).json(bookList))
    .catch(error => res.status(500).json({ error }));
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

public_users.get('/fetch-book-by-isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn
  try {
    const response = await axios.get(`https://bharaths-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`); // Replace 'URL_TO_GET_BOOKS' with the actual URL to fetch books
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

public_users.get("/get-promissed-book-by-isbn/:isbn", function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((bookList) => {
      let data = null;
      const isbn = req.params.isbn;
      data = bookList[isbn];
      res.status(200).json(data);
    })
    .catch((error) => res.status(500).json({ error }));
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


public_users.get("/get-promissed-book-by-author/:author", function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((bookList) => {
      let data = [];
      const author = req.params.author;
      Object.keys(bookList).forEach(key => {
        if (bookList[key].author === author) {
          data.push(bookList[key])
        }
      })
      res.status(200).json(data);
    })
    .catch((error) => res.status(500).json({ error }));
});

public_users.get('/fetch-book-by-author/:author', async function (req, res) {
  const author = req.params.author
  try {
    const response = await axios.get(`https://bharaths-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`); // Replace 'URL_TO_GET_BOOKS' with the actual URL to fetch books
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
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

public_users.get("/get-promissed-title/:title", function (req, res) {
  new Promise((resolve, reject) => {
      resolve(books);
  }).then((bookList) => {
          let data = [];
          const title = req.params.title;
          Object.keys(bookList).forEach(key => {
              if (bookList[key].title === title) {
                  data.push(bookList[key])
              }
          })
      return res.status(200).json(data);
  }).catch((error) => res.status(500).json({ error }));
});

public_users.get('/fetch-book-by-title/:title', async function (req, res) {
  const title = req.params.title
  try {
      const response = await axios.get(`https://bharaths-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`); // Replace 'URL_TO_GET_BOOKS' with the actual URL to fetch books
      return res.status(200).json(response.data);
  } catch (error) {
      return res.status(500).json({ error: error });
  }
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
