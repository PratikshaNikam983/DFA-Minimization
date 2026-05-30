
const express = require('express');
const router = express.Router();
const { minimizeHandler } = require('../controllers/dfaController');

router.post('/minimize', minimizeHandler);

module.exports = router;
