// models/User.js
require("dotenv").config();
const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

const User = sequelize.define(
  "users",
  {
    lokasyonId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    grupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cinsiyet: {
      type: DataTypes.ENUM("Erkek", "Kadın", "Diğer"),
      allowNull: true,
    },
    tcno: { type: DataTypes.STRING(11), unique: true, allowNull: false },
    sicil: { type: DataTypes.STRING, unique: true, allowNull: false },
    ad: { type: DataTypes.STRING, allowNull: false },
    soyad: { type: DataTypes.STRING, allowNull: false },
    kullanici_adi: { type: DataTypes.STRING, allowNull: false, unique: true },
    sifre: { type: DataTypes.STRING, allowNull: false },
    telefon: { type: DataTypes.STRING, allowNull: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    il: { type: DataTypes.STRING, allowNull: true },
    ilce: { type: DataTypes.STRING, allowNull: true },
    adres: { type: DataTypes.TEXT, allowNull: true },
    ise_giris_tarihi: { type: DataTypes.DATE, allowNull: true },
    image: { type: DataTypes.TEXT, allowNull: true },
    durum: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    is2FAEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

// JWT token oluşturma
User.prototype.createAuthToken = function () {
  const expiresIn = "24h"; // Token süresi (kullanıcı oturum süresi)

  // jwt.sign fonksiyonunun ikinci parametresi olarak expiresIn'ı geçiyoruz
  return jwt.sign(
    { id: this.id, isAdmin: this.isAdmin, name: this.name }, // Payload
    jwtPrivateKey, // Gizli anahtar
    { expiresIn } // Token süresi
  );
};
User.beforeCreate(async (user) => {
  if (user.sifre) {
    // Şifreyi hashle
    user.sifre = await bcrypt.hash(user.sifre, 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed("sifre")) {
    // Şifre değiştirildiyse hashle
    user.sifre = await bcrypt.hash(user.sifre, 10);
  }
});

module.exports = User;
