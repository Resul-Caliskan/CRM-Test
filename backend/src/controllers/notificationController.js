const Notification = require("../models/notification");

exports.addNotification = async (req, res) => {
  try {
    const newNotification = new Notification({
      type: req.body.type,
      url: req.body.url,
      state: false,
      message: req.body.message,
      companyId: req.body.companyId,
      positionId: req.body.positionId,
      nomineeId: req.body.nomineeId,
      receiverCompanyId: req.body.receiverCompanyId,
    });
    await newNotification.save();

    res.status(201).json({ message: "Bildirim başarıyla eklendi.", notificationId: newNotification._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllNotificationsByCompanyId = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiverCompanyId: req.params.id });
    res.status(200).json({ notifications: notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {

    const positionId = req.params.positionId;
    const nomineeId = req.params.nomineeId;

    const deletedNotification = await Notification.findOneAndDelete({ positionId: positionId, nomineeId: nomineeId });
    if (!deletedNotification) {
      return res.status(404).json({ message: "Bildirim bulunamadı." });
    }
    console.log(deletedNotification);
    res.status(200).json({ message: "Bildirim başarıyla silindi.", notification: deletedNotification });
    console.log("başarıyla silindi");
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        state: true,

      },

    );
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};