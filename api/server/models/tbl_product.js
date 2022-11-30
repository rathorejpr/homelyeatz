'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_Product.init({
    UserID: DataTypes.INTEGER,
    ProductName: DataTypes.STRING,
    CuisineID: DataTypes.INTEGER,
    ServeSizeID: DataTypes.INTEGER,
    QuantityML: DataTypes.INTEGER,
    Pieces: DataTypes.INTEGER,
    Price: DataTypes.INTEGER,
    Image: DataTypes.STRING,
    Description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tbl_Product',
  });
  return tbl_Product;
};