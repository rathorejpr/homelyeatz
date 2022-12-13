const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class ProductImagesService {
  static async add(data) {
    try {
      let response = await sqlQ.create(
        "tbl_ProductImages",
        { ...data },
        "ProductImgID"
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async get() {
    try {
      let response = await sqlQ.getAll("tbl_ProductImages");
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
      let WhereCondition = `ProductImgID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_ProductImages",
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
      let WhereCondition = `ProductImgID = '${id}'`;
      let response = await sqlQ.findByID("tbl_ProductImages", WhereCondition);
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
      let WhereCondition = `ProductImgID = '${id}'`;
      let response = await sqlQ.destroy("tbl_ProductImages", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async deleteByProductImg(ProductImgID) {
    try {
      let response = await sqlQ.joinQuery(
        `DELETE FROM tbl_MealImages WHERE ProductImgID IN (${ProductImgID})`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async deleteByProductID(ProductID, IsCover) {
    try {
      // DELETE FROM tbl_MealProducts WHERE MealID = 6 AND ProductID in (13,14)
      let response = await sqlQ.joinQuery(
        `DELETE FROM tbl_MealImages WHERE ProductID =  ${ProductID} AND IsCover = ${IsCover};`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductImagesService;
