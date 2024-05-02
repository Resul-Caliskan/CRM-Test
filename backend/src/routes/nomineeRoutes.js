const express = require("express");
const router = express.Router();
const nomineeController = require("../controllers/nomineeController");

router.post("/nominee/add", nomineeController.addNominee);

router.post("/nominee/get-nominees", nomineeController.getNomineeByCompanyId);

router.put("/nominee/add-favorites/:id", nomineeController.addFavorite);

router.put("/nominee/delete-favorites/:id", nomineeController.deleteFavorites);

router.get("/nominee/get-favorites/:id", nomineeController.getAllFavorites);

router.post(
  "/nominee/get-position-nominees",
  nomineeController.getNomineeByPositionId
);

module.exports = router;