const fs = require("fs"),
  getDb = require("./getDb"),
  readline = require("readline");

const insertWords = async () => {
  const db = await getDb();
  const readInterface = readline.createInterface({
    input: fs.createReadStream("./corncob_lowercase.txt"),
    output: process.stdout,
    console: false,
  });

  readInterface.on("line", (word) => {
    db.collection("dictionary").insertOne({ word: word });
  });
  db.collection("dictionary").createIndex({ word: 1 });
};

insertWords();
