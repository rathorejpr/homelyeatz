'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_Footer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_Footer.init({
    Image: DataTypes.STRING,
    Description: DataTypes.STRING,
    Address: DataTypes.STRING,
    Phone: DataTypes.BIGINT,
    Email: DataTypes.STRING,
    Facebook: DataTypes.STRING,
    Google: DataTypes.STRING,
    Instagram: DataTypes.STRING,
    Youtube: DataTypes.STRING,
    Twitter: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tbl_Footer',
  });
  return tbl_Footer;
};