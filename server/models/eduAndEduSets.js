const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const EduAndEduSet = sequelize.define(
  "eduAndEduSets",
  {
    educationId: {
      type: DataTypes.INTEGER,
      references: {
        model: "educations",
        key: "id",
      },
    },
    educationSetId: {
      type: DataTypes.INTEGER,
      references: {
        model: "educationSets",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = EduAndEduSet;
