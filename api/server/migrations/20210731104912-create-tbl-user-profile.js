"use strict";

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tbl_UserProfiles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserType: {
        type: Sequelize.INTEGER,
      },
      UserName: {
        type: Sequelize.STRING,
      },
      Name: {
        type: Sequelize.STRING,
      },
      Email: {
        type: Sequelize.STRING,
      },
      Mobile: {
        type: Sequelize.STRING,
      },
      EmailVerified: {
        type: Sequelize.INTEGER,
      },
      MobileVerified: {
        type: Sequelize.INTEGER,
      },
      otp: {
        type: Sequelize.STRING,
      },
      Password: {
        type: Sequelize.STRING,
      },
      isTempPassword: {
        type: Sequelize.INTEGER,
      },
      viaLogin: {
        type: Sequelize.STRING,
      },
      device_token: {
        type: Sequelize.STRING,
      },
      isDigitalVerified: {
        type: Sequelize.INTEGER,
      },
      isFoodHandlingVerified: {
        type: Sequelize.INTEGER,
      },
      isActive: {
        type: Sequelize.INTEGER,
      },
      CreartedBy: {
        type: Sequelize.STRING,
      },
      Locid: {
        type: Sequelize.INTEGER,
      },
      State: {
        type: Sequelize.STRING,
      },
      Country: {
        type: Sequelize.STRING,
      },
      PhoneWithCountryCode: {
        type: sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tbl_UserProfiles");
  },
};
