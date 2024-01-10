const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let matchingBooks = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn]["author"] === req.params.author) {
        matchingBooks.push({"isbn": isbn,
                            "title": books[isbn]["title"],
                            "reviews": books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({matchingBooks}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let matchingBooks = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn]["title"] === req.params.title) {
        matchingBooks.push({"isbn": isbn,
                            "author": books[isbn]["author"],
                            "reviews": books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({matchingBooks}, null, 4)); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);
});

// TASK 10 - Get the book list available in the shop using Promises
public_users.get('/books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
    });
    get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// TASK 11 - Get the book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    const getBookBasedOnIsbn = new Promise((resolve, reject) => {
        resolve(res.send(books[isbn]));
    });
    getBookBasedOnIsbn.then(() => console.log("Promise for Task 11 resolved"));
});

// TASK 12 - Get book details based on author
public_users.get('/books/author/:author',function (req, res) {
    const getBookBasedOnAuthor = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }
    });
    reject(res.send("The mentioned author does not exist "))
    });
    getBookBasedOnAuthor.then(function(){
            console.log("Promise from Task 12 is resolved");
   }).catch(function () { 
                console.log('The mentioned author does not exist');
   });
});

// TASK 13 - Get book details based on title
public_users.get('/books/title/:title',function (req, res) {
    const getBookBasedOnTitle = new Promise((resolve, reject) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
      }
    });
    reject(res.send("The mentioned title does not exist "))
    });
    getBookBasedOnTitle.then(function(){
            console.log("Promise from Task 13 is resolved");
   }).catch(function () { 
                console.log('The mentioned title does not exist');
   });
});

module.exports.general = public_users;
