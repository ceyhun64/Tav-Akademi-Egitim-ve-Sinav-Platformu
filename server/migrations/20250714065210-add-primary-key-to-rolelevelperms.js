"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Önce var olan primary key kaldırılırsa sonra yeni eklenebilir
    return queryInterface.sequelize.query(`
      ALTER TABLE rolelevelperms
      DROP PRIMARY KEY,
      ADD PRIMARY KEY (roleLevelId, permissionId);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Geri alırken primary key’i kaldır veya eski haline getir
    return queryInterface.sequelize.query(`
      ALTER TABLE rolelevelperms
      DROP PRIMARY KEY;
    `);
  },
};
