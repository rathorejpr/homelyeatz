const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class MealService {
  static async add(data) {
    try {
      let response = await sqlQ.create(
        "tbl_MealImages",
        { ...data },
        "MealImgID"
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async get() {
    try {
      let response = await sqlQ.getAll("tbl_MealImages");
      return response;
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
      let response = await database.tbl_Meal.findOne({
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

  static async update(data, id) {
    try {
      let WhereCondition = `MealImgID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_MealImages",
        { ...data },
        WhereCondition
      );
      // let response = await sql.query(`UPDATE tbl_UserProfile
      // SET ${update_set.join(",")} WHERE UserID = ${id}`)
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      // let response = await sql.query(
      //   `SELECT * FROM tbl_UserProfile WHERE UserID = '${id}'  `
      // );
      let WhereCondition = `MealImgID = '${id}'`;
      let response = await sqlQ.findByID("tbl_MealImages", WhereCondition);
      // let response = await database.tbl_UserProfile.findOne({
      //   where: { id: Number(id) },
      // });
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      let WhereCondition = `MealImgID = '${id}'`;
      let response = await sqlQ.destroy("tbl_MealImages", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async deleteByMealImg(MealImgID) {
    try {
      let response;
      if (MealImgID && MealImgID.length) {
        response = await sqlQ.joinQuery(
          `DELETE FROM tbl_MealImages WHERE MealImgID IN (${MealImgID})`
        );
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async deleteByMealID(MealID, IsCover) {
    try {
      // DELETE FROM tbl_MealProducts WHERE MealID = 6 AND ProductID in (13,14)
      let response = await sqlQ.joinQuery(
        `DELETE FROM tbl_MealImages WHERE MealID =  ${MealID} AND IsCover = ${IsCover};`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MealService;
