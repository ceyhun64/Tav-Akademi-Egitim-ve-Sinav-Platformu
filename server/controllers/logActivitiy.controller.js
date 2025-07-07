const { ActivityLog } = require("../models/index");

exports.getLogActivity = async (req, res) => {
  try {
    const logActivity = await ActivityLog.findAll();
    res.status(200).json(logActivity);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
