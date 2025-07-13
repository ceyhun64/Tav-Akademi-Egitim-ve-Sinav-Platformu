const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const CourseType = sequelize.define("coursetypes", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = CourseType;
