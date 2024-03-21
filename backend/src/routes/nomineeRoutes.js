const express = require("express");
const router = express.Router();
const nomineeController = require("../controllers/nomineeController");

router.post("/nominee/add", nomineeController.addNominee);

router.post("/nominee/get-nominees", nomineeController.getNomineeByCompanyId);

router.post(
  "/nominee/get-position-nominees",
  nomineeController.getNomineeByPositionId
);

module.exports = router;