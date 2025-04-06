const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');
const { protect } = require('../middleware/auth');

router.post('/add', protect, basketController.addToBasket);
router.get('/', protect, basketController.getBasket);
router.delete('/remove/:deviceId', protect, basketController.removeFromBasket);
router.delete('/clear', protect, basketController.clearBasket);

module.exports = router;
