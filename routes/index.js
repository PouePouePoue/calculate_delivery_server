const express = require('express');
const router = express.Router();


const authRoutes = require('./auth');
const requestRoutes = require('./requests');
const calculationRoutes = require('./calculations');


router.use(authRoutes);
router.use(requestRoutes);
router.use(calculationRoutes);



module.exports = router;