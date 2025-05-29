const { MongoClient } = require('mongodb');

const connectMongo = async (uri) => {
  if (!uri) throw new Error('MongoDB URI is required');

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();

  const dbNameMatch = uri.match(/\/([a-zA-Z0-9_-]+)(\?|$)/);
  if (!dbNameMatch || !dbNameMatch[1]) {
    throw new Error('Database name not found in URI (e.g., /myDatabase)');
  }
  const dbName = dbNameMatch[1];
  const db = client.db(dbName);

  return { client, db };
};

module.exports = connectMongo;