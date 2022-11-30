const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery
class CusineService {


    static async getAll() {
        try {
            const response = await sqlQ.getAll('tblADM_DietaryMaster')
            return response
        } catch (error) {
            throw error;
        }
    }

}

module.exports = CusineService;
