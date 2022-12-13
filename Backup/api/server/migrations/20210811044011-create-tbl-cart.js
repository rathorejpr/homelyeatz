'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      ProductId: {
        type: Sequelize.INTEGER
      },
      MealId: {
        type: Sequelize.INTEGER
      },
      ChefId: {
        type: Sequelize.INTEGER
      },
      OfferId: {
        type: Sequelize.INTEGER
      },
      Quantity: {
        type: Sequelize.INTEGER
      },
      isActive: {
        type: Sequelize.STRING
      },
      Ingredients: {
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
    await queryInterface.dropTable('tbl_Carts');
  }
};