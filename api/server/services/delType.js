const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class DelTypeService {
  static async getAll() {
    try {
      let WhereCondition = `IsActive = '1'`;
      let response = await sqlQ.findByID("tblADM_DelType", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DelTypeService;
