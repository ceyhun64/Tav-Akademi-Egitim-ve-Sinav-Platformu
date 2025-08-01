const express = require("express");
const router = express.Router();
const illegalMovesController = require("../controllers/illegalMoves.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, illegalMovesController.getIllegalMoves);

router.post("/", verifyToken, illegalMovesController.addIllegalMoves);

router.delete("/:id", verifyToken, illegalMovesController.deleteIllegalMove);

module.exports = router;
