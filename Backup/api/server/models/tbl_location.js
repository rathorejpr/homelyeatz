'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_Location.init({
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    uId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_Location',
  });
  return tbl_Location;
};