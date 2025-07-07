const express = require("express");
const router = express.Router();
const logActivitiyController = require("../controllers/logActivitiy.controller");
const authorize = require("../middlewares/authorize");

router.get("/", logActivitiyController.getLogActivity);

module.exports = router;
