const express = require('express');
const controller = require('../controllers/authController');

const router = express.Router();


// [POST] Register request.
router.post('/register', controller.register);

// [POST] Login request.
router.post('/', controller.login);


module.exports = router;
