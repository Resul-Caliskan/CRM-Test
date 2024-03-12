// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const demandController = require('../controllers/demandController');
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");


// Müşteri ekleme rotası
router.post('/demand', demandController.addDemand);


// Tüm müşterileri çekme rotası
router.get('/demand', demandController.getAllDemands);


router.delete('/demands/:id', demandController.deleteDemand);

module.exports = router;