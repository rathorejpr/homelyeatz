'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_Meals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mealName: {
        type: Sequelize.STRING
      },
      FileName: {
        type: Sequelize.STRING
      },
      discount: {
        type: Sequelize.STRING
      },
      availableFrom: {
        type: Sequelize.DATE
      },
      availableTo: {
        type: Sequelize.DATE
      },
      OrderByDate: {
        type: Sequelize.DATE
      },
      totalMealPrice: {
        type: Sequelize.INTEGER
      },
      OrderByTime: {
        type: Sequelize.DATE
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      ProductId: {
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
    await queryInterface.dropTable('tbl_Meals');
  }
};