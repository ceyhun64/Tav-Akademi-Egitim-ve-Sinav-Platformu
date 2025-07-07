const {
  User,
  Role,
  RoleLevel,
  Permission,
  RoleLevelPerm,
} = require("../models/index");
const logActivity = require("../helpers/logActivity");
const { Op } = require("sequelize");

exports.getRoles = async (req, res) => {
  try {
    const roleId = req.user?.roleId;

    if (!roleId) {
      return res.status(400).json({ message: "Kullanıcının rolü yok" });
    }

    const role = await Role.findByPk(roleId);

    if (!role) {
      return res.status(404).json({ message: "Rol bulunamadı" });
    }

    const level = role.level;

    const roles = await Role.findAll({
      where: {
        level: {
          [Op.gte]: level,
        },
      },
    });

    res.status(200).json(roles);
  } catch (err) {
    console.error("getRoles error:", err);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, roleLevelId } = req.body;
    const roleLevel = await RoleLevel.findByPk(roleLevelId);
    const level = roleLevel.level;
    const role = await Role.create({
      name,
      roleLevelId,
      level,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından rol oluşturuldu.`,
      category: "Role",
    });
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roleLevelId } = req.body;
    const roleLevel = await RoleLevel.findByPk(roleLevelId);
    const level = roleLevel.level;
    const role = await Role.update(
      {
        name,
        roleLevelId,
        level,
      },
      {
        where: {
          id,
        },
      }
    );
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından rol güncellendi.`,
      category: "Role",
    });
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        status: "error",
        message: "Role not found",
      });
    }
    await role.destroy();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından rol silindi.`,
      category: "Role",
    });
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.getRoleLevels = async (req, res) => {
  try {
    const roleLevels = await RoleLevel.findAll();
    res.status(200).json(roleLevels);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.createRoleLevel = async (req, res) => {
  try {
    const { name, level } = req.body;

    const roleLevel = await RoleLevel.create({
      name,
      level,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından rol seviyesi oluşturuldu.`,
      category: "Role",
    });
    res.status(201).json(roleLevel);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.updateRoleLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level } = req.body;
    const roleLevel = await RoleLevel.findByPk(id);
    if (!roleLevel) {
      return res.status(404).json({
        status: "error",
        message: "Role level not found",
      });
    }
    roleLevel.update({
      name,
      level,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından rol seviyesi güncellendi.`,
      category: "Role",
    });
    res.status(200).json(roleLevel);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.deleteRoleLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const roleLevel = await RoleLevel.findByPk(id);
    if (!roleLevel) {
      return res.status(404).json({
        status: "error",
        message: "Role level not found",
      });
    }

    await roleLevel.destroy();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından rol seviyesi silindi.`,
      category: "RoleLevel",
    });
    res.status(200).json(roleLevel);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json(permissions);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.getRoleLevelPerms = async (req, res) => {
  try {
    const { id } = req.params;
    const roleLevelPerms = await RoleLevelPerm.findAll({
      where: {
        roleLevelId: id,
      },
    });
    res.status(200).json(roleLevelPerms);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.createRoleLevelPerm = async (req, res) => {
  try {
    const { roleLevelId, permissionIds } = req.body; // permissionIds dizisi

    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "permissionIds must be a non-empty array",
      });
    }

    const createRoleLevelPerms = permissionIds.map((permissionId) =>
      RoleLevelPerm.create({ roleLevelId, permissionId })
    );

    const roleLevelPerms = await Promise.all(createRoleLevelPerms);

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından yeni rol seviyesi yetkileri verildi.`,
      category: "Role",
    });
    res.status(201).json(roleLevelPerms);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.updateRoleLevelPerm = async (req, res) => {
  try {
    const { roleLevelId, permissionIds } = req.body;

    // Önce eski izinleri temizle
    await RoleLevelPerm.destroy({ where: { roleLevelId } });

    // Yeni izinleri ekle
    const newPerms = permissionIds.map((permissionId) => ({
      roleLevelId,
      permissionId,
    }));
    const roleLevelPerms = await RoleLevelPerm.bulkCreate(newPerms);
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından rol seviyesi yetkileri güncellendi.`,
      category: "Role",
    });

    res.status(200).json(roleLevelPerms);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.getAuthorizedUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    const grupId = user.grupId;
    const lokasyonId = user.lokasyonId;
    const roleId = user.roleId;
    const role = await Role.findOne({ id: roleId });
    const roleLevelId = role.roleLevelId;
  } catch (error) {
    console.error("Yetkili kullanıcıları alma hatası:", error);
    res.status(500).json({ message: error.message || "Sunucu hatası." });
  }
};
exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    user.roleId = roleId;
    await user.save();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından kullanıcıya rol atandı.`,
      category: "Role",
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
