const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class MealService {
  static async add(data) {
    try {
      let response = await sqlQ.create(
        "tbl_ProductDetails",
        { ...data },
        "ProductDetailsID"
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async deleteByDealTypeAndDeatailIDAndProductID(
    removeData,
    DealType,
    ProductID
  ) {
    try {
      let response = await sqlQ.joinQuery(
        `DELETE FROM tbl_ProductDetails WHERE ProductID =  ${ProductID} AND DetailTypeID = ${DealType} AND DetailID IN (${removeData.join(
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
