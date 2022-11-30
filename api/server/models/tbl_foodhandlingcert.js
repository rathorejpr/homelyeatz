'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_FoodHandlingCert extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_FoodHandlingCert.init({
    DocumentName: DataTypes.STRING,
    FileName: DataTypes.STRING,
    ProviderName: DataTypes.STRING,
    CertificationTitle: DataTypes.STRING,
    CertificateNumber: DataTypes.STRING,
    CertificateExpiryDate: DataTypes.STRING,
    UploadedBy: DataTypes.INTEGER,
    StateofIssue: DataTypes.INTEGER,
    Status: DataTypes.INTEGER,
    CertificateIssuedOn: DataTypes.STRING,
    ApprovedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_FoodHandlingCert',
  });
  return tbl_FoodHandlingCert;
};