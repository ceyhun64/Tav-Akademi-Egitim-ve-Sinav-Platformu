const {
  User,
  Role,
  RoleLevel,
  RoleLevelPerm,
  Permission,
} = require("../models/index");

function authorize(permissionId) {
  return async function (req, res, next) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ message: "Kullanıcı kimliği bulunamadı." });
      }

      // Kullanıcıyı ilişkili role ve roleLevel ile birlikte getir
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          as: "role",
          include: {
            model: RoleLevel,
            as: "roleLevel",
          },
        },
      });

      // Kullanıcı, role veya roleLevel eksikse
      if (!user || !user.role || !user.role.roleLevel) {
        return res
          .status(403)
          .json({ message: "Yetkilendirme bilgisi eksik veya hatalı." });
      }

      const roleLevelId = user.role.roleLevel.id;

      // RoleLevel’e ait izinleri getir
      const perms = await RoleLevelPerm.findAll({
        where: { roleLevelId },
        include: [{ model: Permission, as: "permission" }],
      });

      const hasPermission = perms.some(
        (rlp) => rlp.permission?.id === permissionId
      );

      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: "Erişim reddedildi: izin yetersiz." });
      }

      // Yetkili ise devam et
      next();
    } catch (error) {
      console.error("Authorization error:", error);

      // Eager loading alias hataları için özel mesaj
      if (error.name === "SequelizeEagerLoadingError") {
        return res.status(500).json({
          message:
            "Model ilişkilerinde alias hatası. Lütfen backend yapılandırmasını kontrol edin.",
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }

      res
        .status(500)
        .json({ message: "Sunucu hatası (authorize middleware)." });
    }
  };
}

module.exports = authorize;
