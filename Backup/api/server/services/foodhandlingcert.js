const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class FoodCertificationService {
  static async add(data) {
    try {
      let response = await sqlQ.create(
        "tbl_FoodHandlingCert",
        { ...data },
        "DocumentID"
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  static async get(UserID) {
    try {
      let WhereCondition = `UploadedBy = '${UserID}'`;
      let response = await sqlQ.findByID(
        "tbl_FoodHandlingCert",
        WhereCondition
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findOne(data) {
    try {
      let WhereCondition = `DocumentID = '${id}'`;
      let response = await sqlQ.findByID(
        "tbl_FoodHandlingCert",
        WhereCondition
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async update(data, id) {
    try {
      let WhereCondition = `DocumentID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_FoodHandlingCert",
        { ...data },
        WhereCondition
      );
      // let response = await sql.query(`UPDATE tbl_UserProfile
      // SET ${update_set.join(",")} WHERE UserID = ${id}`)
      return response;
      // let response = await database.tbl_FoodHandlingCert.update(data, { where: { id: id } });
      // if (response) {
      //     response = await database.tbl_FoodHandlingCert.findOne({ where: { id: id } });
      // }
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      let WhereCondition = `DocumentID = '${id}'`;
      let response = await sqlQ.destroy("tbl_Products", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FoodCertificationService;
