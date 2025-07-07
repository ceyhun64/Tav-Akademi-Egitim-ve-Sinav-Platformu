const sequelize = require("../data/db");
const { DataTypes } = require("sequelize");

const Certificate = sequelize.define("certificates", {
  tc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  educationSet_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  education_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false,
    defaulValue: "Tav Güvenlik",
  },
  requester: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  education_date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  exam_date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  educatorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  teo_exam_report: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  img_exam_report: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  average_score: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  certificate_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  certificate_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Certificate;
