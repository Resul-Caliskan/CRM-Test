const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

router.post('/sendemail',authenticationMiddleware.authenticateToken, emailController.sendEmail);

module.exports = router;