const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

router.post('/create', itemController.create);
router.post('/storeDetail', itemController.getDetailStore);
router.post('/tag', itemController.findByTag);
router.post('/:id', itemController.findById);
//router.post('/search', itemController.findByDeepSearching);

module.exports = router;
