const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
class ProductService {
  static async add(data) {
    try {
      let response = await sqlQ.create(
        "tbl_Products",
        { ...data },
        "ProductID"
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async get() {
    try {
      let response = await sqlQ.joinQuery(
        `select i.*
        from  tbl_Products i ,tbl_UserProfile U
        where i.ChefID = U.UserID;`
      );
      for (let i in response.recordset) {
        let ingredientData = await sqlQ.joinQuery(
          `select i.ProductID,i.IngredientID,p.IngredientName  from  tbl_ProductsIngredients i , tblADM_IngredientsMaster p where i.IngredientID = p.IngredientsID AND i.ProductID = ${response.recordset[ i ].ProductID} ;`
        );
        response.recordset[ i ].IngredientData = ingredientData.recordset;
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getProductWithPagination(query) {
    try {
      let limit = query.limit ? query.limit : 10;
      let offSet = query.page ? query.page * limit : 0;
      let response = await sqlQ.joinQuery(
        `select i.*
        from  tbl_Products i
        ORDER BY i.ModifiedOn DESC
        OFFSET ${offSet} ROWS FETCH NEXT ${limit} ROWS ONLY;`
      );

      for (let i in response.recordset) {
        let ingredientData = await sqlQ.joinQuery(
          `select i.ProductID,i.IngredientID,p.IngredientName  from  tbl_ProductsIngredients i , tblADM_IngredientsMaster p where i.IngredientID = p.IngredientsID AND i.ProductID = ${response.recordset[ i ].ProductID} ;`
        );
        response.recordset[ i ].IngredientData = ingredientData.recordset;
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async searchProductByUser(data, query) {
    try {
      let limit = query.limit ? query.limit : 10;
      let offSet = query.page ? query.page * limit : 0;
      let Condition = {};

      if (data) {
        Condition = {
          ...Condition,
          ...data,
        };
      }
      let keys1 = Object.keys(Condition);
      let AND_Set = keys1.map((value) => {
        if (value === "ProductName") {
          return `i.${value} LIKE '%${Condition[ value ]}%'`;
        } else {
          return `i.${value} = '${Condition[ value ]}'`;
        }
      });
      let response = [];
      if (Object.keys(Condition).length) {
        response = await sqlQ.joinQuery(
          `select i.*,U.Country,U.State
          from  tbl_Products i,tbl_UserProfile U
          where ${AND_Set.join(
            " AND "
          )} AND  U.UserID = i.ChefID
          ORDER BY i.ModifiedOn DESC
          OFFSET ${offSet} ROWS FETCH NEXT ${limit} ROWS ONLY;`
        );
      } else {
        response = await sqlQ.joinQuery(
          `select i.*,U.Country,U.State
          from  tbl_Products i  ,tbl_UserProfile U
          where  U.UserID = i.ChefID
          ORDER BY i.ModifiedOn DESC
          OFFSET ${offSet} ROWS FETCH NEXT ${limit} ROWS ONLY;`
        );
      }
      for (let i in response.recordset) {
        let ingredientData = await sqlQ.joinQuery(
          `select i.ProductID,i.IngredientID,p.IngredientName  from  tbl_ProductsIngredients i , tblADM_IngredientsMaster p where i.IngredientID = p.IngredientsID AND i.ProductID = ${response.recordset[ i ].ProductID} ;`
        );
        response.recordset[ i ].IngredientData = ingredientData.recordset;
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getAllProductByChefID(id, query) {
    try {
      let limit = query.limit ? query.limit : 100000;
      let offSet = query.page ? query.page * limit : 0;
      let response = await sqlQ.joinQuery(
        `select *
        from  tbl_Products
        where ChefID = '${id}'
        ORDER BY ModifiedOn DESC
        OFFSET ${offSet} ROWS FETCH NEXT ${limit} ROWS ONLY;`
      );;
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findOne(data) {
    try {
      let response = await database.tbl_Product.findOne({
        where: {
          [ Op.or ]: [ { email: data.email }, { phone: data.email } ],
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
      let WhereCondition = `ProductID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_Products",
        { ...data },
        WhereCondition
      );
      if (response) {
        response = await sqlQ.findByID("tbl_Products", WhereCondition);
      }
      return response.recordset[ 0 ];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      let response =
        await sqlQ.joinQuery(`select i.*
        ,U.Country,U.State  from  tbl_Products i  ,tbl_UserProfile U
      where U.UserID = i.ChefID  AND ProductID = '${id}' ;`);
      if (response) {
        let ingredientData = await sqlQ.joinQuery(
          `select i.ProductID,i.IngredientID,p.IngredientName  from  tbl_ProductsIngredients i , tblADM_IngredientsMaster p where i.IngredientID = p.IngredientsID AND i.ProductID = ${id} ;`
        );
        response.recordset[ 0 ].IngredientData =
          ingredientData && ingredientData.recordset
            ? ingredientData.recordset
            : [];
        return response.recordset[ 0 ];
      } else {
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      let WhereCondition = `ProductID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_Products",
        { IsDeleted: 1 },
        WhereCondition
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
