const express = require('express');
const { createRequest } = require('../controllers/requestController');
const router = express.Router();

router.post('/api/requests', createRequest);

module.exports = router;