'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tblADM_UserType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tblADM_UserType.init({
    UserType: DataTypes.STRING,
    CreatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tblADM_UserType',
  });
  return tblADM_UserType;
};