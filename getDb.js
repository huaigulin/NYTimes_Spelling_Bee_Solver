const mongodb = require("mongodb"),
  url = "mongodb://localhost:27017",
  dbName = "spelling_bee",
  client = new mongodb.MongoClient(url, { useUnifiedTopology: true });
let _db = null;

const connect = async () => {
  await client.connect();
  console.log("Connected to MongoDB!");
  _db = client.db(dbName);
};

const getDb = async () => {
  if (!_db || !client.isConnected()) await connect();
  return _db;
};

module.exports = getDb;
