const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

router.post('/sendemail', emailController.sendEmail);


router.post('/sendemail-password', emailController.sendChangePasswordMail);

module.exports = router;