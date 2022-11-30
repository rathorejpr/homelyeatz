const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery
class ProductTypeService {
    static async getAll() {
        try {
            const response = await sqlQ.getAll('tblADM_ProductType')
            return response
        } catch (error) {
            throw error;
        }
    }

}

module.exports = ProductTypeService;
