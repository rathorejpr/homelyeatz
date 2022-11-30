const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class LocationService {
  static async add(data) {
    try {
      return await database.tbl_Location.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async updateData(data, id) {
    try {
      return await database.tbl_Location.update(data, { where: { uId: id } });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LocationService;
