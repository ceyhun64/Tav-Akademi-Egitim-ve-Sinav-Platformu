const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const EducationSetUser = sequelize.define(
  "educationSetUsers",
  {
    educationSetId: {
      type: DataTypes.INTEGER,
      references: {
        model: "educationSets",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    completed: {
      type: DataTypes.BOOLEAN, //bitirmiş mi bitirmemiş mi
      defaultValue: false,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    entry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    entry_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    exit_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    exit_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    educator: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: false,
  }
);

module.exports = EducationSetUser;
