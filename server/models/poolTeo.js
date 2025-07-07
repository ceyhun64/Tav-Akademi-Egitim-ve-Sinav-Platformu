const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const PoolTeo = sequelize.define(
  "poolTeos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    a: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    b: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    c: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    d: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    e: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bookletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "booklets",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    difLevelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "difLevels",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = PoolTeo;
