const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class MealService {
  static async add(data) {
    try {
      let response = await sqlQ.create(
        "tbl_ProductsIngredients",
        { ...data },
        "ProductID"
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  static async deleteByIngredientIDAndProductID(
    removeIngredientData,
    ProductID
  ) {
    try {
      // DELETE FROM tbl_MealProducts WHERE MealID = 6 AND ProductID in (13,14)
      let response = await sqlQ.joinQuery(
        `DELETE FROM tbl_ProductsIngredients WHERE ProductID =  ${ProductID} AND IngredientID IN (${removeIngredientData.join(
          ","
        )})`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MealService;
