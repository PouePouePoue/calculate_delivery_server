const express = require('express');
const { calculateDistance, estimateCost } = require('../controllers/calculationController');
const router = express.Router();

router.post('/api/calculate-distance', calculateDistance);
router.post('/api/estimate-cost', estimateCost);

module.exports = router;