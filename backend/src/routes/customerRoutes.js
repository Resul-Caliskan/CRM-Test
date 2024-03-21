const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

router.post(
  "/",
  authenticationMiddleware.authenticateToken,
  customerController.addCustomer
);

router.put(
  "/:id",
  authenticationMiddleware.authenticateToken,
  customerController.updateCustomer
);

router.delete(
  "/:id",
  authenticationMiddleware.authenticateToken,
  customerController.deleteCustomer
);

router.get("/", customerController.getAllCustomers);

router.get(
  "/:id",
  authenticationMiddleware.authenticateToken,
  customerController.getCustomerById
);

router.put("/add/:id", customerController.userAddToCustomer);

router.get(
  "/get/:name",
  authenticationMiddleware.authenticateToken,
  customerController.getCustomerByName
);

router.get("/getname/:id", customerController.getCustomerNameById);
module.exports = router;
