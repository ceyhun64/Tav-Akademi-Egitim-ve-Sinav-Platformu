const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const CourseNo = sequelize.define("coursenoes", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = CourseNo;
