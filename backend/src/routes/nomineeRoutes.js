const express = require('express');
const router = express.Router();
const nomineeController = require('../controllers/nomineeController');

router.post('/nominee/add', nomineeController.addNominee);

router.post('/nominee/aday-admin', nomineeController.getNomineeByCompanyIdAdmin);

router.post('/nominee/pozisyon-admin', nomineeController.getNomineeByPositionIdAdmin); 

router.post('/nominee/aday-user', nomineeController.getNomineeByCompanyIdUser);

router.post('/nominee/pozisyon-user', nomineeController.getNomineeByPositionIdUser); 

module.exports = router;