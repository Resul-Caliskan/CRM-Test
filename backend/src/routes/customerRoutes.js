// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

// Müşteri ekleme rotası
router.post(
  "/",
  authenticationMiddleware.authenticateToken,
  customerController.addCustomer
);

// Müşteri güncelleme rotası
router.put(
  "/:id",
  authenticationMiddleware.authenticateToken,
  customerController.updateCustomer
);

// Müşteri silme rotası
router.delete(
  "/:id",
  authenticationMiddleware.authenticateToken,
  customerController.deleteCustomer
);

// Tüm müşterileri çekme rotası
router.get("/", customerController.getAllCustomers);

//Müşterileri Id'ye göre çekme rotası
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

router.get(
  "/getname/:id",
  customerController.getCustomerNameById
);
module.exports = router;
