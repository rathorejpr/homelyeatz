const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
const MealService = require("./meal");
const ProductService = require("./product");
var sqlQ = new SqlQuery();
class CartService {
  static async add(data) {
    try {
      let response = await sqlQ.create("tbl_Cart", { ...data }, "CartID");
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async addCartIngredient(data) {
    try {
      let response = await sqlQ.create(
        "tbl_CartIngredient",
        { ...data },
        "ProductID"
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findIngredientByCartID(CartID) {
    try {
      let response = await sqlQ.joinQuery(
        `select IM.*,CI.CartID,CI.ProductID from  tbl_CartIngredient CI , tblADM_IngredientsMaster IM WHERE CartID = '${CartID}' AND IM.IngredientsID = CI.IngredientsID;`
      );
      return response.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async get(UserID) {
    try {
      let WhereCondition = `UserID = '${UserID}' AND IsDeleted = '0' AND IsActive = '1'`;
      let response = await sqlQ.findByID("tbl_Cart", WhereCondition);
      let Total = 0;
      if (response && response.recordset.length) {
        for (let i in response.recordset) {
          let Meal = await MealService.findById(
            response.recordset[i].MealID,
            UserID
          );
          Total =
            Total + response.recordset[i].Quantity * Meal.TotalSumAfterDiscount;
          response.recordset[i].Meal = Meal;
        }
      }
      // response.recordset.push({ Total: Total });
      return { response: response, Total: Total };
    } catch (error) {
      console.log(error, "llll");
      throw error;
    }
  }

  static async find(data) {
    try {
      let WhereCondition = `UserID = '${data.UserID}' AND MealID = '${data.MealID}' AND IsDeleted = '${data.IsDeleted}' AND IsActive = '${data.IsActive}'`;
      let response = await sqlQ.findByID("tbl_Cart", WhereCondition);
      return response.recordset;
    } catch (error) {
      console.log(error);
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
      let response = await database.tbl_Cart.findOne({
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
      let WhereCondition = `CartID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_Cart",
        { ...data },
        WhereCondition
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id, UserID) {
    try {
      let WhereCondition = `CartID = '${id}'`;
      let response = await sqlQ.findByID("tbl_Cart", WhereCondition);
      if (response && response.recordset.length) {
        for (let i in response.recordset) {
          let Meal = await MealService.findById(
            response.recordset[i].MealID,
            UserID
          );
          response.recordset[i].Meal = Meal;
        }
      }
      return response.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async deleteByIngredients(CartID) {
    try {
      let response = await sqlQ.joinQuery(
        `DELETE FROM tbl_CartIngredient WHERE CartID IN (${CartID})`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      let WhereCondition = `CartID = '${id}'`;
      let response = await sqlQ.destroy("tbl_Cart", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartService;
