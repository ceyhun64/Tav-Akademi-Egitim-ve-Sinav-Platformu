const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Announcement = sequelize.define("announcements", {
  institutionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Announcement;
