const fs = require("fs"),
  getDb = require("./getDb"),
  readline = require("readline");

const insertWords = async () => {
  const db = await getDb();
  const readInterface = readline.createInterface({
    input: fs.createReadStream("./words_alpha.txt"),
    output: process.stdout,
    console: false,
  });

  readInterface.on("line", (word) => {
    db.collection("dictionary").insertOne({ word: word }, (error, result) => {
      if (error) throw error;
      console.log(`Inserted word: ${word}`)
    });
  });
  db.collection("dictionary").createIndex({ word: 1 });
};

insertWords();
