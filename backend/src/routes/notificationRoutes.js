const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/notification/add", notificationController.addNotification);

router.get("/notification/get-notifications/:id", notificationController.getAllNotificationsByCompanyId);

router.put("/notification/mark-as-read/:id", notificationController.markAsRead);

router.delete("/notification/delete/:positionId/:nomineeId", notificationController.deleteNotification);


module.exports = router;