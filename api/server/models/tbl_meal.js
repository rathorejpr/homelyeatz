'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_Meal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_Meal.init({
    mealName: DataTypes.STRING,
    FileName: DataTypes.STRING,
    discount: DataTypes.STRING,
    availableFrom: DataTypes.DATE,
    availableTo: DataTypes.DATE,
    OrderByDate: DataTypes.DATE,
    totalMealPrice: DataTypes.INTEGER,
    OrderByTime: DataTypes.DATE,
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tbl_Meal',
  });
  return tbl_Meal;
};