const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const Booklet = sequelize.define(
  "booklets",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("teo", "img"),
      allowNull: false,
    },
    question_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Booklet;
