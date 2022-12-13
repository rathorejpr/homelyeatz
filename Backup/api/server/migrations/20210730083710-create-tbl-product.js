'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserID: {
        type: Sequelize.INTEGER
      },
      ProductName: {
        type: Sequelize.STRING
      },
      CuisineID: {
        type: Sequelize.INTEGER
      },
      ServeSizeID: {
        type: Sequelize.INTEGER
      },
      QuantityML: {
        type: Sequelize.INTEGER
      },
      Pieces: {
        type: Sequelize.INTEGER
      },
      Price: {
        type: Sequelize.INTEGER
      },
      Image: {
        type: Sequelize.STRING
      },
      Description: {
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
    await queryInterface.dropTable('tbl_Products');
  }
};