const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class SuperAdminService {
  static async addRole(data) {
    try {
      return await database.tblADM_UserType.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async checkExitUser(data) {
    try {
      return await database.User.count({
        where: {
          [Op.or]: [{ email: data.email }, { phone: data.email }],
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async findOne(data) {
    try {
      let response = await database.User.findOne({
        where: {
          [Op.or]: [{ email: data.email }, { phone: data.email }],
          role: data.role,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async updateData(data, id) {
    try {
      let response = await database.User.update(data, { where: { id: id } });
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      let response = await database.User.findOne({
        where: { id: id },
        include: [
          {
            model: database.Location,
            as: "locationDetails",
            required: false,
          },
        ],
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SuperAdminService;
