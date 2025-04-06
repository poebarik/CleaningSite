const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Create a new request
router.post('/', requestController.createRequest);

// Get all requests
router.get('/', requestController.getAllRequests);

module.exports = router;