const express = require('express');
const controller = require('../controllers/authController');

const router = express.Router();


// [POST] Register request.
router.post('/register', controller.register);


module.exports = router;
