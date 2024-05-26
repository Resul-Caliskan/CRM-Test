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
router.get("/all-customers",customerController.getCustomers);
router.get(
  "/:id",
  
  customerController.getCustomerById
);

router.put("/add/:id", customerController.userAddToCustomer);

router.put("/add-industry/:id", customerController.industryAddToCustomer);

router.put("/delete-industry/:id", customerController.industryRemoveFromCustomer);

router.get("/get-industry/:id", customerController.getCustomerIndustries);

router.put("/add-company/:id", customerController.companyAddToCustomer);

router.put("/delete-company/:id", customerController.companyRemoveFromCustomer);

router.get("/get-companies/:id", customerController.getCustomerCompanies);

router.put("/edit-companies/:id", customerController.updateCompanyByName);

router.get(
  "/get/:name",
  authenticationMiddleware.authenticateToken,
  customerController.getCustomerByName
);

router.get("/getname/:id", customerController.getCustomerNameById);
module.exports = router;
