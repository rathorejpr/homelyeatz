const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class RatingService {
  static async add(data) {
    try {
      let response = await sqlQ.create("tbl_Ratings", { ...data }, "Rating_ID");
      let WhereCondition = `Rating_ID = '${response.recordset[0].Rating_ID}'`;
      response = await sqlQ.findByID("tbl_Ratings", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async find(data) {
    try {
      let WhereCondition = `CustomerID = '${data.CustomerID}' AND MealID = '${data.MealID}' AND ChefID = '${data.ChefID}'`;
      let response = await sqlQ.findByID("tbl_Ratings", WhereCondition);
      return response.recordset;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async update(data, id) {
    try {
      let WhereCondition = `Rating_ID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_Ratings",
        { ...data },
        WhereCondition
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RatingService;
