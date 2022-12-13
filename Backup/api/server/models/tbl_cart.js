'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_Cart.init({
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    MealId: DataTypes.INTEGER,
    ChefId: DataTypes.INTEGER,
    OfferId: DataTypes.INTEGER,
    Quantity: DataTypes.INTEGER,
    isActive: DataTypes.STRING,
    Ingredients: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tbl_Cart',
  });
  return tbl_Cart;
};