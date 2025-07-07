const express = require("express");
const router = express.Router();
const poolImgController = require("../controllers/poolImg.controller");
const { uploadSingle } = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");  
const authorize = require("../middlewares/authorize");

// GET poolImgs by bookletId
router.get("/booklet/:bookletId",verifyToken, poolImgController.getPoolImgsByBookletId);

// GET a single poolImg by ID
router.get("/:id",verifyToken, poolImgController.getPoolImgById);

// GET all poolImgs
router.get("/",verifyToken, poolImgController.getPoolImgs);

// POST a new poolImg
router.post("/", verifyToken,uploadSingle, poolImgController.createPoolImg);

// PUT (update) a poolImg by ID
router.put("/:id",verifyToken, uploadSingle, poolImgController.updatePoolImg);

// DELETE a poolImg by ID
router.delete("/:id", verifyToken,poolImgController.deletePoolImg);

module.exports = router;
