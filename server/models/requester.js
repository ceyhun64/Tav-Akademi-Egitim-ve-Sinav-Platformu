const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const Requester = sequelize.define("requester", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = Requester;
