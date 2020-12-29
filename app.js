#!/usr/bin/env node
const express = require("express"),
    app = express(),
    port = process.env.NODE_PORT || 8080,
    bodyParser = require("body-parser");
const getDb = require("./getDb"),
    readline = require("readline");

// Listen on a port
app.listen(port, () => console.log(`Listening on port ${port}`));

// Middleware to help with parsing request body
app.use(bodyParser.json());

// Allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.get("/", (req, res) => {
    res.send("OK");
});

app.post("/findWords", async (req, res) => {
    const letters = req.body.letters;
    const centerLetter = req.body.centerLetter;
    const words = await findWords(letters, centerLetter);
    res.send(words);
});

const findWords = async (letters, centerLetter) => {
    const db = await getDb();
    const dictionary = db.collection("dictionary");
    letters = letters.split("");
    queue = letters.slice();
    const words = [];
    while (queue.length != 0) {
        let prefix = queue.shift();
        if (prefix.length >= 4 && prefix.includes(centerLetter)) {
            const result = await dictionary.findOne({ word: prefix });
            if (result != null) words.push(prefix);
        }
        for (let i = 0; i < letters.length; i++) {
            let word = prefix + letters[i];
            const result = await dictionary.findOne({
                word: { $regex: `^${word}` },
            });
            if (result != null) {
                queue.push(word);
            }
        }
    }
    return words;
};

const main = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question(
        'Type all the letters and then type the center letter, separate by space\nFor example, "ltdobuf l"\n',
        (text) => {
            rl.close();
            text = text.split(" ");
            findWords(text[0], text[1]);
        }
    );
};

// main();
