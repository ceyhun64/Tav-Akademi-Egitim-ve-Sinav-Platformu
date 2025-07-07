const express = require("express");
const router = express.Router();
const bookletController = require("../controllers/booklet.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

// GET /booklet
router.get("/", verifyToken, authorize(2), bookletController.getBooklets);

/// GET /booklet/type/:type
router.get(
  "/type/:type",
  verifyToken,
  authorize(2),
  bookletController.getBookletByType
);

// GET /booklet/teo
router.get("/teo", verifyToken, authorize(2), bookletController.getTeoBooklets);

// GET /booklet/img
router.get("/img", verifyToken, authorize(2), bookletController.getImgBooklets);

// GET /booklet/:id
router.get("/:id", verifyToken, authorize(2), bookletController.getBookletById);

// POST /booklet
router.post(
  "/",
  verifyToken,
  authorize(2),
  authorize(36),
  bookletController.createBooklet
);

// PUT /booklet/:id
router.put("/:id", verifyToken, authorize(2), bookletController.updateBooklet);

// DELETE /booklet/:id
router.delete(
  "/:id",
  verifyToken,
  authorize(2),
  authorize(37),
  bookletController.deleteBooklet
);

module.exports = router;
