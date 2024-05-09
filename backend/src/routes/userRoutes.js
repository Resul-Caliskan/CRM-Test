const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/user-check-mail', userController.checkUserMail);
router.put('/user-update-password/:id', userController.updatePassword);
router.put('/user/:id',userController.updateUser);
router.get('/user/:id',userController.getUserById);
module.exports = router;