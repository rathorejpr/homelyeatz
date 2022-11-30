'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_FoodHandlingCerts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DocumentName: {
        type: Sequelize.STRING
      },
      FileName: {
        type: Sequelize.STRING
      },
      ProviderName: {
        type: Sequelize.STRING
      },
      CertificationTitle: {
        type: Sequelize.STRING
      },
      CertificateNumber: {
        type: Sequelize.STRING
      },
      CertificateExpiryDate: {
        type: Sequelize.DATE
      },
      UploadedBy: {
        type: Sequelize.INTEGER
      },
      StateofIssue: {
        type: Sequelize.INTEGER
      },
      Status: {
        type: Sequelize.INTEGER
      },
      CertificateIssuedOn: {
        type: Sequelize.INTEGER
      },
      ApprovedBy: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_FoodHandlingCerts');
  }
};