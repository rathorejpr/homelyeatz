const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class BusinessService {
  static async add(data) {
    try {
      let response = await sqlQ.create("tbl_BusinessDetails", { ...data }, "ChefID");
      let WhereCondition = `ChefID = '${data.ChefID}' `;
      response = await sqlQ.findByID("tbl_BusinessDetails", WhereCondition)
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async update(data, ChefID) {
    try {
      let WhereCondition = `ChefID = '${ChefID}' `;
      let response = await sqlQ.findByIDAndUpdate("tbl_BusinessDetails", { ...data }, WhereCondition);
      response = await sqlQ.findByID("tbl_BusinessDetails", WhereCondition)
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async get(ChefID) {
    try {
      let WhereCondition = `ChefID = '${ChefID}' `;
      let response = await sqlQ.findByID("tbl_BusinessDetails", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BusinessService;
