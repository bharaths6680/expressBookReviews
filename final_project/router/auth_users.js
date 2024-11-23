const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.filter(user => user.username === username).length > 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.filter(user => user.username === username && user.password === password).length > 0
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  try {
    if(!username || !password){
      throw new Error("Username and password are required");
    }
    if(authenticatedUser(username,password)){
      let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
      // Store access token and username in session
      req.session.authorization = {
        accessToken, username
    }
      return res.status(200).json({accessToken});
    }
    throw new Error("Invalid user credentials");
  } catch (error) {
    res.status(400).json({ error: error.toString() })
  }
});

regd_users.get("/users", (req, res) => {
  //Write your code here  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.query;
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;
  try {
    if (!user || !isbn || !review) {
      throw new Error("User, isbn and review are required");
    }
    if (isValid(user)) {
      if (books[isbn].reviews.hasOwnProperty(user)) {
        books[isbn].reviews[user] = review;
      } else {
        books[isbn].reviews[user] = review;
      }
    }
    return res.status(200).json({ message: "Review added/modified successfully" });
  } catch (error) {
    res.status(400).json({ error: error.toString() })
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;
  try {
    if (!user || !isbn) {
      throw new Error("User and isbn are required");
    }
    if (books[isbn].reviews.hasOwnProperty(user)) {
      delete books[isbn].reviews[user];
    }
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.toString() })
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
