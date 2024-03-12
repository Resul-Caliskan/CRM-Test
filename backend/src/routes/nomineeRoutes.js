const express = require('express');
const router = express.Router();
const nomineeController = require('../controllers/nomineeController');

router.post('/nominee/add', nomineeController.addNominee);

router.post('/nominee/aday-admin', nomineeController.getNomineeByCompanyIdAdmin);

router.post('/nominee/pozisyon', nomineeController.getNomineeByPositionId); 

router.post('/nominee/adayuser', nomineeController.getNomineeByCompanyIdUser);

module.exports = router;