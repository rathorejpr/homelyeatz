'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_Contact.init({
    Name: DataTypes.STRING,
    Email: DataTypes.STRING,
    Message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tbl_Contact',
  });
  return tbl_Contact;
};