const express = require("express");
const router = express.Router();
const positionController = require("../controllers/positionController");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

router.post("/positions", positionController.addPosition);

router.put("/positions/:id", positionController.updatePosition);

router.delete("/positions/:id", positionController.deletePosition);

router.get("/positions", positionController.getAllPositions);

router.put("/positions/add/:id", positionController.addNomineeIdToPosition);
router.put(
  "/positions/delete/:id",
  positionController.deleteNomineeIdFromPosition
);

router.get("/positions/get/:id", positionController.getPositionByCompanyId);

router.get(
  "/positions/:id",
  authenticationMiddleware.authenticateToken,
  positionController.getPositionById
);

router.get("/positions/get/:id", positionController.getPositionByCompanyId);
module.exports = router;