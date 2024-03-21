const express = require('express');
const roleController = require('../controllers/roleController');
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const router = express.Router();

router.post('/role',authenticationMiddleware.authenticateToken, roleController.addRole);
router.get('/role',authenticationMiddleware.authenticateToken, roleController.getAllRoles);

module.exports = router;
