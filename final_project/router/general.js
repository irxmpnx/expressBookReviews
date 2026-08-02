const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");
axios.get("http://localhost:3000/")

const getBooks = () => {
    return new Promise((resolve) => {
        resolve(books);
    });
};

function doesExist(username) {
    return users.some((user) => user.username === username);
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Missing username or password"});
    } else if (doesExist(username)) {
        return res.status(404).json({message: "User already exists."});
    } else {
        users.push({
            username: username,
            password: password
        });

        return res.status(200).json({message: "User successfully registered. Please login."});
    }

});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const data = await getBooks();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const data = await getBooks();
    const book = data[req.params.isbn];

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({message:"ISBN not found."});
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const data = await getBooks();
        let result = [];

        for (let key in data) {
            if (data[key].author === req.params.author) {
                result.push(data[key]);
            }
        }

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                message: "Author not found"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const data = await getBooks();
        let result = [];

        for (let key in data) {
            if (data[key].title === req.params.title) {
                result.push(data[key]);
            }
        }

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                message: "Title not found"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);
  let getisbn = books[isbn];
  if (getisbn){
    return res.status(200).send(JSON.stringify(getisbn.reviews, null, 4));
    } else {
        return res.status(404).json({message: "ISBN not found."});
    }
});

module.exports.general = public_users;
