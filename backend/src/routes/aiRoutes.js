const express = require('express');
const aiController = require('../controllers/aiController');
const router = express.Router();

router.post('/ask-ai', aiController.askAi);

router.post('/fake-ask-ai', aiController.fakeAskAi)
module.exports = router;