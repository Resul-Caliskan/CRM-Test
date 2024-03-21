const express = require("express");
const router = express.Router();
const demandController = require("../controllers/demandController");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

router.post("/demand", demandController.addDemand);

router.get("/demand", demandController.getAllDemands);

router.delete("/demands/:id", demandController.deleteDemand);

module.exports = router;
