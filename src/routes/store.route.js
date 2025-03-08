const storeController = require('../controllers/store.controller');
const express = require('express');
const router = express.Router();

router.get('/getAll', storeController.getAllStores);
router.post('/create', storeController.createStore);

module.exports = router;