"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbl_UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_UserProfile.init(
    {
      UserType: DataTypes.INTEGER,
      UserName: DataTypes.STRING,
      Name: DataTypes.STRING,
      Email: DataTypes.STRING,
      Mobile: DataTypes.STRING,
      EmailVerified: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      MobileVerified: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      Password: DataTypes.STRING,
      isTempPassword: DataTypes.INTEGER,
      viaLogin: DataTypes.STRING,
      isDigitalVerified: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isFoodHandlingVerified: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isActive: DataTypes.INTEGER,
      CreartedBy: DataTypes.STRING,
      Locid: DataTypes.INTEGER,
      State: DataTypes.STRING,
      Country: DataTypes.STRING,
      device_token: DataTypes.STRING,
      otp: DataTypes.STRING,
      PhoneWithCountryCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tbl_UserProfile",
    }
  );
  return tbl_UserProfile;
};
