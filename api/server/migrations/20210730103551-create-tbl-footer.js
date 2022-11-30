'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_Footers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Image: {
        type: Sequelize.STRING
      },
      Description: {
        type: Sequelize.STRING
      },
      Address: {
        type: Sequelize.STRING
      },
      Phone: {
        type: Sequelize.BIGINT
      },
      Email: {
        type: Sequelize.STRING
      },
      Facebook: {
        type: Sequelize.STRING
      },
      Google: {
        type: Sequelize.STRING
      },
      Instagram: {
        type: Sequelize.STRING
      },
      Youtube: {
        type: Sequelize.STRING
      },
      Twitter: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_Footers');
  }
};