// models/Session.js
const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const Session = sequelize.define(
  "sessions",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Session;
