const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const Educator = sequelize.define("educator", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = Educator;
