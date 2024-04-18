const express = require("express");
const router = express.Router();
const parameterController = require("../controllers/parameterController");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

router.post("/parameters", parameterController.addParameter);

router.put("/parameters/:id", parameterController.updateParameter);

router.delete("/parameters/:id", parameterController.deleteParameter);

router.delete('/:parameterId/values/:valueId', parameterController.deleteParameterValue);

router.get("/parameters", parameterController.getAllParameters);

module.exports = router;
