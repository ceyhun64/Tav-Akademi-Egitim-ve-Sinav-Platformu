const express = require("express");
const router = express.Router();

const roleController = require("../controllers/role.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

// RoleLevelPerm routes
router.get(
  "/role-level-perm/:id",
  verifyToken,
  authorize(21),
  roleController.getRoleLevelPerms
);
router.post(
  "/role-level-perm",
  verifyToken,
  authorize(21),
  roleController.createRoleLevelPerm
);
router.put(
  "/role-level-perm",
  verifyToken,
  authorize(21),
  roleController.updateRoleLevelPerm
);

// RoleLevel routes

router.get(
  "/role-level",
  verifyToken,
  authorize(21),
  roleController.getRoleLevels
);
router.post(
  "/role-level",
  verifyToken,
  authorize(21),
  roleController.createRoleLevel
);
router.put(
  "/role-level/:id",
  verifyToken,
  authorize(21),
  roleController.updateRoleLevel
);
router.delete(
  "/role-level/:id",
  verifyToken,
  authorize(21),
  roleController.deleteRoleLevel
);

// Permission routes
router.get(
  "/permissions",
  verifyToken,
  authorize(21),
  roleController.getPermissions
);

// Role routes
router.get("/", verifyToken, authorize(21), roleController.getRoles);
router.put(
  "/assign",
  verifyToken,
  authorize(21),
  roleController.assignRoleToUser
);
router.post("/", verifyToken, authorize(21), roleController.createRole);
router.put("/:id", verifyToken, authorize(21), roleController.updateRole);
router.delete("/:id", verifyToken, authorize(21), roleController.deleteRole);

module.exports = router;
