const connectMongo = require('../utils/connectMongo');

exports.connectToMongo = async (req, res) => {
  const { uri } = req.body;
  try {
    const { db } = await connectMongo(uri);
    const collections = await db.listCollections().toArray();
    res.json({ success: true, collections });
  } catch (err) {
    console.error('Connection error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.createInitialCollection = async (req, res) => {
  const { uri, collectionName, initialDoc } = req.body;
  try {
    const { db } = await connectMongo(uri);
    const result = await db.collection(collectionName).insertOne(initialDoc || {});
    res.json({ success: true, message: 'Database and collection created', insertedId: result.insertedId });
  } catch (err) {
    console.error('Create initial collection error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getDocuments = async (req, res) => {
  const { uri, collectionName } = req.body;
  try {
    const { db } = await connectMongo(uri);
    const documents = await db.collection(collectionName).find({}).toArray();
    res.json({ success: true, documents });
  } catch (err) {
    console.error('Get documents error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.createDocument = async (req, res) => {
  const { uri, collectionName, document } = req.body;
  try {
    const { db } = await connectMongo(uri);
    const result = await db.collection(collectionName).insertOne(document);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error('Create document error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateDocument = async (req, res) => {
  const { uri, collectionName, id, updatedDocument } = req.body;
  try {
    const { db } = await connectMongo(uri);
    const { ObjectId } = require('mongodb');

    // Remove _id field if present
    if (updatedDocument._id) delete updatedDocument._id;

    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedDocument }
    );

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Update document error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  const { uri, collectionName, id } = req.body;
  try {
    const { db } = await connectMongo(uri);
    const { ObjectId } = require('mongodb');
    const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error('Delete document error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};