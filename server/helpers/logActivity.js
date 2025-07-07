const { ActivityLog } = require("../models/index");

function logActivity({ userId, action, category }) {
  try {
    return ActivityLog.create({
      userId,
      action,
      category,
    });
  } catch (error) {
    console.error("Log kaydedilirken hata oluştu:", error);
  }
}

module.exports = logActivity;
