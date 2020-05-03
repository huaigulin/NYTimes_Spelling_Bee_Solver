const getDb = require("./getDb"),
  readline = require("readline");

const findWords = async (letters, centerLetter) => {
  const db = await getDb();
  const dictionary = db.collection("dictionary");
  letters = letters.split("");
  queue = letters.slice();
  while (queue.length != 0) {
    let prefix = queue.shift();
    if (prefix.length >= 4 && prefix.includes(centerLetter)) {
      const result = await dictionary.findOne({ word: prefix });
      if (result != null) console.log(prefix);
    }
    for (let i = 0; i < letters.length; i++) {
      let word = prefix + letters[i];
      const result = await dictionary.findOne({ word: { $regex: `^${word}` } });
      if (result != null) {
        queue.push(word);
      }
    }
  }
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

main();
