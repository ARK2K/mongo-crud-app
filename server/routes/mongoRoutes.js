const express = require('express');
const router = express.Router();
const controller = require('../controllers/mongoController');

router.post('/connect', controller.connectToMongo);
router.post('/init', controller.createInitialCollection);
router.post('/documents', controller.getDocuments);
router.post('/create', controller.createDocument);
router.post('/update', controller.updateDocument);
router.post('/delete', controller.deleteDocument);

module.exports = router;