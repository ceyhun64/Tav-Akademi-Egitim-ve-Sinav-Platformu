const express = require("express");
const router = express.Router();
const logActivitiyController = require("../controllers/logActivitiy.controller");
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, logActivitiyController.getLogActivity);

module.exports = router;
