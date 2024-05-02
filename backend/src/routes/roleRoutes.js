const express = require('express');
const roleController = require('../controllers/roleController');
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const router = express.Router();

router.post('/role', roleController.addRole);
router.get('/role', roleController.getAllRoles);

module.exports = router;
