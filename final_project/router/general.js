const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const axios = require('axios').default;

const url = "https://raw.githubusercontent.com/ibm-developer-skills-network/expressBookReviews/main/booksdb.json";


// Check if user already exists
function doesExist(username) {
    return users.some((user) => user.username === username);
}


// Register a new user
public_users.post("/register", function(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Missing username or password"
        });
    }

    if (doesExist(username)) {
        return res.status(404).json({
            message: "User already exists."
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Please login."
    });

});


// Get the book list available in the shop
public_users.get('/', function(req, res) {

    axios.get(url)
        .then(function(response) {

            console.log("Fulfilled");

            res.status(200).json(response.data);

        })
        .catch(function(error) {

            console.log("Rejected");

            res.status(500).json({
                message: error.message
            });

        });

});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {

    axios.get(url)
        .then(function(response) {

            const data = response.data;
            const book = data[req.params.isbn];

            if (book) {

                return res.status(200).json(book);

            } else {

                return res.status(404).json({
                    message: "ISBN not found."
                });

            }

        })
        .catch(function(error) {

            return res.status(500).json({
                message: error.message
            });

        });

});


// Get book details based on author
public_users.get('/author/:author', function(req, res) {

    axios.get(url)
        .then(function(response) {

            const data = response.data;
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

        })
        .catch(function(error) {

            return res.status(500).json({
                message: error.message
            });

        });

});


// Get all books based on title
public_users.get('/title/:title', function(req, res) {

    axios.get(url)
        .then(function(response) {

            const data = response.data;
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

        })
        .catch(function(error) {

            return res.status(500).json({
                message: error.message
            });

        });

});


// Get book review
public_users.get('/review/:isbn', function(req, res) {

    let isbn = parseInt(req.params.isbn);
    let getisbn = books[isbn];

    if (getisbn) {

        return res.status(200).send(
            JSON.stringify(getisbn.reviews, null, 4)
        );

    } else {

        return res.status(404).json({
            message: "ISBN not found."
        });

    }

});


module.exports.general = public_users;