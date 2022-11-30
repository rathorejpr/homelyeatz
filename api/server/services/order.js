const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class OrderService {
  static async add(data) {
    try {
      let response = await sqlQ.create("tbl_Order", { ...data }, "OrderID");
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getByOrderIDWithPendingStatus(data) {
    try {
      console.log("data====================>", data);
      const response = await sqlQ.joinQuery(`SELECT O.*
        from  tbl_Order O
        WHERE status = 'Pending' AND OrderID = '${data.OrderID}'
        `);
      return response.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getLatestOrderFeedbackPending(data) {
    try {
      const response = await sqlQ.joinQuery(`select O.status,O.OrderID, O.ModifiedOn 
      from tbl_Order O where UserID = '${Number(data)}' AND status = 'Conform' ORDER BY O.ModifiedOn DESC OFFSET ${0} ROWS FETCH NEXT ${1} ROWS ONLY
      `);
      if (response.recordset.length) {
        let orderData = await OrderService.findByIDForPendingFeedback(Number(response.recordset[ response.recordset.length - 1 ].OrderID), data);
        let filter = orderData[ orderData.length - 1 ].productData.filter((e) => e.feedback === 0);
        if (filter.length) {
          orderData.productData = filter;
          response.recordset = orderData
        } else {
          response.recordset = []
        }
      }
      return response.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getOrderByUser(UserID) {
    try {
      const response = await sqlQ.joinQuery(`SELECT O.*,C.Quantity,
       M.MealID,M.ChefID,M.IsPublished,M.DTimeTo,M.TotalSum,M.TotalDiscocunt,M.TotalSumAfterDiscount,
      M.AvailableFrom,M.AvailableTo,M.LeadTime,M.DelType,
      M.DelKm, M.DelTimeFrom,M.DelTimeTo,M.CancelLeadHours,M.DelFee,M.MealName
        from  tbl_Order O,tbl_Cart C,tbl_Meal M
        WHERE O.CartID = C.CartID AND C.MealID = M.MealID  AND O.UserID = '${UserID}'
        ORDER BY O.ModifiedOn DESC`);
      // for (let i in response.recordset) {
      //   let productData = await sqlQ.joinQuery(`SELECT MP.OrgProductPrice,MP.NewProductPrice,P.ProductName,P.ProductID,P.ProfileName
      //      from  tbl_MealProducts MP,tbl_Products P
      //      WHERE MP.MealID = '${response.recordset[ i ].MealID}' AND P.ProductID = MP.ProductID`);
      //   response.recordset[ i ].productData = productData.recordset
      // }
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getProductByMealID(MealID, orderID, UserID) {
    try {
      let productData =
        await sqlQ.joinQuery(`SELECT MP.OrgProductPrice,MP.NewProductPrice,P.ProductName,P.ProductID,P.ProfileName,
      (select isnull(count(*), 0) from tbl_Feedback F where F.OrderID = '${orderID}' AND MP.MealID = '${MealID}' AND P.ProductID = MP.ProductID AND F.ProductID = P.ProductID AND F.DinerID = '${UserID}') as feedback
           from  tbl_MealProducts MP,tbl_Products P
           WHERE MP.MealID = '${MealID}' AND P.ProductID = MP.ProductID`);
      return productData.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getOrderByChef(ChefID) {
    try {
      const response = await sqlQ.joinQuery(`SELECT O.*,C.Quantity,
       M.MealID,M.ChefID,M.IsPublished,M.TotalSum,M.TotalDiscocunt,M.TotalSumAfterDiscount,
      M.AvailableFrom,M.AvailableTo,M.LeadTime,M.DelType,M.DTimeTo,
      M.DelKm, M.DelTimeFrom,M.DelTimeTo,M.CancelLeadHours,M.DelFee,M.MealName,M.MealDesc
      from  tbl_Order O,tbl_Cart C,tbl_Meal M
      WHERE O.CartID = C.CartID AND C.MealID = M.MealID AND M.ChefID = '${ChefID}'
      ORDER BY O.ModifiedOn DESC`);
      // for (let i in response.recordset) {
      //   let productData = await sqlQ.joinQuery(`SELECT MP.OrgProductPrice,MP.NewProductPrice,P.ProductName,P.ProductID,P.ProfileName
      //      from  tbl_MealProducts MP,tbl_Products P
      //      WHERE MP.MealID = '${response.recordset[ i ].MealID}' AND P.ProductID = MP.ProductID`);
      //   response.recordset[ i ].productData = productData.recordset
      // }
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findByID(OrderID) {
    try {
      const response = await sqlQ.joinQuery(`SELECT O.*,C.Quantity,
      M.MealID,M.ChefID,M.IsPublished,M.TotalSum,M.TotalDiscocunt,M.TotalSumAfterDiscount,
      M.AvailableFrom,M.AvailableTo,M.LeadTime,M.DelType,M.DTimeTo,
      M.DelKm, M.DelTimeFrom,M.DelTimeTo,M.CancelLeadHours,M.DelFee,M.MealName,M.MealDesc
      from  tbl_Order O ,tbl_Cart C,tbl_Meal M
      WHERE O.CartID = C.CartID AND C.MealID = M.MealID AND O.OrderID = '${OrderID}'
      ORDER BY O.ModifiedOn DESC`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findByIDForPendingFeedback(OrderID, UserID) {
    try {
      const response = await sqlQ.joinQuery(`SELECT O.*,C.Quantity,
      M.MealID,M.ChefID,M.IsPublished,M.TotalSum,M.TotalDiscocunt,M.TotalSumAfterDiscount,
      M.AvailableFrom,M.AvailableTo,M.LeadTime,M.DelType,M.DTimeTo,
      M.DelKm, M.DelTimeFrom,M.DelTimeTo,M.CancelLeadHours,M.DelFee,M.MealName,M.MealDesc
      from  tbl_Order O ,tbl_Cart C,tbl_Meal M
      WHERE O.CartID = C.CartID AND C.MealID = M.MealID AND O.OrderID = '${OrderID}'
      ORDER BY O.ModifiedOn DESC`);
      for (let i in response.recordset) {
        let productData =
          await sqlQ.joinQuery(`SELECT MP.OrgProductPrice,MP.NewProductPrice,P.ProductName,P.ProductID,P.ProfileName,
          (select isnull(count(*), 0) from tbl_Feedback F where F.OrderID = '${OrderID}' AND MP.MealID = '${response.recordset[ i ].MealID}' AND P.ProductID = MP.ProductID AND F.ProductID = P.ProductID AND F.DinerID = '${UserID}') as feedback
               from  tbl_MealProducts MP,tbl_Products P
               WHERE MP.MealID = '${response.recordset[ i ].MealID}' AND P.ProductID = MP.ProductID`);
        response.recordset[ i ].productData = productData.recordset;
      }
      return response.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async update(data, id) {
    try {
      let WhereCondition = `OrderID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_Order",
        { ...data },
        WhereCondition
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderService;
