const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const PoolImg = sequelize.define(
  "poolImgs",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
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
      allowNull: false,
    },
    d: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    e: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    f: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordinate: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "booklets",
        key: "id",
      },
    },
    questionCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "questionCategories",
        key: "id",
      },
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

module.exports = PoolImg;
