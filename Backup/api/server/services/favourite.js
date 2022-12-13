const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class FavouriteService {
  static async add(data) {
    try {
      let response = await sqlQ.create("tbl_Favourites", { ...data }, "Fav_ID");
      let WhereCondition = `Fav_ID = '${response.recordset[ 0 ].Fav_ID}'`;
      response = await sqlQ.findByID("tbl_Favourites", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async find(data) {
    try {
      let WhereCondition = `CustomerID = '${data.CustomerID}' AND MealID = '${data.MealID}' AND ChefID = '${data.ChefID}'`;
      let response = await sqlQ.findByID("tbl_Favourites", WhereCondition);
      return response.recordset;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findMealIdByNull(data) {
    try {
      let WhereCondition = `CustomerID = '${data.CustomerID}' AND MealID IS NULL AND ChefID = '${data.ChefID}'`;
      let response = await sqlQ.findByID("tbl_Favourites", WhereCondition);
      return response.recordset;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async update(data, id) {
    try {
      let WhereCondition = `Fav_ID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_Favourites",
        { ...data },
        WhereCondition
      );
      response = await sqlQ.findByID("tbl_Favourites", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FavouriteService;
