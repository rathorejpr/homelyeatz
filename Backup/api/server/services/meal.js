const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
const moment = require("moment");
var sqlQ = new SqlQuery();
class MealService {
  static async add(data) {
    try {
      let response = await sqlQ.create("tbl_Meal", { ...data }, "MealID");
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async get() {
    try {
      let WhereCondition = `IsDeleted = '0'`;
      let response = await sqlQ.findByID("tbl_Meal", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getMinAndMaxKM() {
    try {
      let Condition = {
        IsDeleted: 0,
        IsPublished: 1,
      };
      let keys1 = Object.keys(Condition);
      let AND_Set = keys1.map((value) => {
        return `M.${value} = '${Condition[ value ]}'`;
      });
      AND_Set = AND_Set.filter(function (element) {
        return element !== undefined;
      });
      let AvailableFromC;
      let AvailableFrom = moment(new Date()).format("YYYY-MM-DD");
      AvailableFromC = `M.AvailableFrom <= '${AvailableFrom}' AND M.AvailableTo >= '${AvailableFrom}'`;
      let km = { min: 0, max: 0 };

      let min = await sqlQ.joinQuery(
        `SELECT MIN(M.DelKm) as min from  tbl_Meal M 
          WHERE  ${AND_Set.join(" AND ")} AND ${AvailableFromC}`
      );
      if (min && min.recordset && min.recordset[ min.recordset.length - 1 ]) {
        km = { ...km, min: min.recordset[ min.recordset.length - 1 ].min };
      }
      let max = await sqlQ.joinQuery(
        `SELECT MAX(M.DelKm) as max from  tbl_Meal M 
          WHERE  ${AND_Set.join(" AND ")} AND ${AvailableFromC}`
      );
      if (max && max.recordset && max.recordset[ max.recordset.length - 1 ]) {
        km = { ...km, max: max.recordset[ max.recordset.length - 1 ].max };
      }
      console.log(km);
      return km;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async whishlistMealByUser(query, UserID) {
    try {
      let limit = query.limit ? query.limit : 10;
      let offSet = query.page ? query.page * limit : 0;
      let isChef = query.isChef && query.isChef === 'chef' ? true : false;
      let Condition = {
        IsDeleted: 0,
        IsPublished: 1,
      };
      let keys1 = Object.keys(Condition);
      let AND_Set = keys1.map((value) => {
        return `M.${value} = '${Condition[ value ]}'`;
      });
      AND_Set = AND_Set.filter(function (element) {
        return element !== undefined;
      });
      let AvailableFromC;
      let AvailableFrom = moment(new Date()).format("YYYY-MM-DD");
      AvailableFromC = `M.AvailableFrom <= '${AvailableFrom}' AND M.AvailableTo >= '${AvailableFrom}'`;

      let response = await sqlQ.joinQuery(
        `SELECT M.MealID,M.MealDesc,M.DTimeTo,M.ChefID,M.IsPublished,M.TotalSum,M.TotalDiscocunt,M.TotalSumAfterDiscount,
          M.AvailableFrom,M.AvailableTo,M.LeadTime,M.DelType,M.CuisineTypeID,M.MealTypeID,M.DietaryTypeID,
          M.DelKm, M.ModifiedOn,M.DelTimeFrom,M.DelTimeTo,M.CancelLeadHours,M.DelFee,M.MealName, c.CuisineType,pt.ProductType,dm.DietaryReq
          ,(select F.isFav from
            tbl_Favourites F
            WHERE F.MealID = M.MealID AND  F.ChefID = M.ChefID AND F.CustomerID = '${UserID}') as isFavMeal
          ,(select F.isFav from
            tbl_Favourites F
            WHERE F.MealID IS NULL AND  F.ChefID = M.ChefID AND F.CustomerID = '${UserID}') as isFavProfile
          ,U.Country,U.State,U.Postcode,U.ProfileName,U.ImgProfile,U.MyStory,F.isFav,(select isnull(sum(R.Rating)/count(R.Rating), 0) from tbl_Ratings R where M.MealID = R.MealID) as AverageRating,
          (select isnull(count(R.Rating), 0) from tbl_Ratings R where M.MealID = R.MealID) as AverageReviewComment
          from  tbl_Meal M ,tbl_UserProfile  U,tbl_Favourites F, tblADM_CuisineMaster c ,tblADM_ProductType pt,tblADM_DietaryMaster dm
          WHERE
           ${AND_Set.join(
          " AND "
        )} AND  U.UserID = M.ChefID AND ${AvailableFromC} AND
          M.CuisineTypeID = c.CuisineTypeID AND  M.MealTypeID = pt.ProductTypeID AND M.DietaryTypeID = dm.DietaryReqID AND
          F.ChefID = M.ChefID  AND ${isChef ? ' F.MealID IS NULL ' : ' F.MealID = M.MealID '}  AND F.CustomerID = '${UserID}' AND F.isFav = 1
        group by M.MealID,M.MealDesc,M.DTimeTo,M.ChefID,M.IsPublished,M.TotalSum,M.TotalDiscocunt,M.TotalSumAfterDiscount,
        M.AvailableFrom,M.AvailableTo,M.LeadTime,M.DelType,c.CuisineType,pt.ProductType,dm.DietaryReq,M.CuisineTypeID,M.MealTypeID,M.DietaryTypeID,
        M.DelKm, M.ModifiedOn,M.DelTimeFrom,M.DelTimeTo,M.CancelLeadHours,M.DelFee,M.MealName
        ,U.Country,U.State,U.Postcode,F.isFav,U.ProfileName,U.ImgProfile,U.MyStory
       ORDER BY M.ModifiedOn DESC
       OFFSET ${offSet} ROWS FETCH NEXT ${limit} ROWS ONLY`);

      for (let i in response.recordset) {
        response.recordset[ i ].isFav = response.recordset[ i ].isFavMeal
          ? response.recordset[ i ].isFavMeal
          : false;
        response.recordset[ i ].isFavProfile = response.recordset[ i ].isFavProfile
          ? response.recordset[ i ].isFavProfile
          : false;
        let ProductData = await sqlQ.joinQuery(
          `select MP.MealID,P.* from
          tbl_Meal M , tbl_MealProducts MP,tbl_Products P
          WHERE MP.MealID = M.MealID AND MP.ProductID = P.ProductID  AND M.MealID = ${response.recordset[ i ].MealID};`
        );
        response.recordset[ i ].ProductData = ProductData.recordset
          ? ProductData.recordset
          : [];
        let MealImages = await sqlQ.joinQuery(
          `select MI.MealID,MI.MealImgID,MI.MealImg,MI.IsCover  from  tbl_Meal M , tbl_MealImages MI WHERE MI.MealID = M.MealID AND M.MealID = ${response.recordset[ i ].MealID} ;`
        );
        response.recordset[ i ].MealImages = MealImages.recordset;
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async uniqueArray2(arr) {
    var a = [];
    for (var i = 0, l = arr.length; i < l; i++)
      if (a.indexOf(arr[ i ]) === -1 && arr[ i ] !== "") a.push(arr[ i ]);
    return a;
  }

  static async searchMealByUser(data, query, UserID) {
    try {
      let limit = query.limit ? query.limit : 10;
      let offSet = query.page ? query.page * limit : 0;
      let Table = [ "tbl_Meal M" ];
      Table.push("tbl_UserProfile  U");
      Table.push("tblADM_CuisineMaster C");
      Table.push("tblADM_ProductType pt");
      Table.push("tblADM_DietaryMaster dm");
      let Condition = {
        IsDeleted: 0,
        IsPublished: 1,
      };
      if (data) {
        Condition = {
          ...Condition,
          ...data,
        };
      }
      let keys1 = Object.keys(Condition);
      let AND_Set = keys1.map((value) => {
        if (value === "DelKm") {
          if (!isNaN(`${Condition[ value ]}`)) {
            Condition[ value ] = Number(Condition[ value ]);
            if (Condition[ value ] !== 0) {
              let one = 0;
              let two = Condition[ value ] + 0.5;
              return `M.DelKm BETWEEN ${one} AND ${two}`;
            }
          }
        } else if (value === "Rating") {
          if (!isNaN(`${Condition[ value ]}`)) {
            Condition[ value ] = Number(Condition[ value ]);
            if (Condition[ value ] !== 0) {
              let one = Condition[ value ] - 0.5;
              let two = Condition[ value ] + 0.5;
              return `(select isnull(sum(R.Rating)/count(R.Rating), 0) from tbl_Ratings R where M.MealID = R.MealID) BETWEEN ${one} AND ${two}`;
            }
          }
        } else if (value === "LocalityId") {
          if (!isNaN(`${Condition[ value ]}`)) {
            Table.push("tbl_ChefDeliveryArea CDA");
            return `CDA.ChefId = M.ChefID AND CDA.LocalityID = ${Condition[ value ]}`;
          }
        } else if (value === "MealName") {
          Table.push("tbl_MealProducts MP");
          Table.push("tbl_Products P");
          return `((M.${value} LIKE '%${Condition[ value ]}%')
          OR (U.ProfileName LIKE '%${Condition[ value ]}%')
          OR (M.CuisineTypeID = C.CuisineTypeID AND C.CuisineType LIKE '%${Condition[ value ]}%')
          OR (M.MealTypeID = pt.ProductTypeID AND pt.ProductType LIKE '%${Condition[ value ]}%')
          OR (M.DietaryTypeID = dm.DietaryReqID AND dm.DietaryReq LIKE '%${Condition[ value ]}%')
          OR (MP.MealID = M.MealID AND MP.ProductID = P.ProductID AND P.ProfileName LIKE '%${Condition[ value ]}%')
         OR (MP.MealID = M.MealID AND MP.ProductID = P.ProductID AND P.ProductName LIKE '%${Condition[ value ]}%'))`;
        } else if (value === "DelType") {
          return `(M.${value} = '${Condition[ value ]}' OR M.DelType = '3')`;
        } else if (
          value !== "AvailableFrom" &&
          value !== "CuisineID" &&
          value !== "MealType" &&
          value !== "DietaryType"
        ) {
          return `M.${value} = '${Condition[ value ]}'`;
        }
      });
      let OR_Set = [];
      OR_Set = keys1.map((value) => {
        if (value === "CuisineID") {
          return `(M.CuisineTypeID = C.CuisineTypeID AND C.CuisineType = '${Condition[ value ]}')`;
        } else if (value === "MealType") {
          return `(M.MealTypeID = pt.ProductTypeID AND pt.ProductType = '${Condition[ value ]}')`;
        } else if (value === "DietaryType") {
          return `(M.DietaryTypeID = dm.DietaryReqID AND dm.DietaryReq = '${Condition[ value ]}')`;
        }
      });
      OR_Set = OR_Set.filter(function (element) {
        return element !== undefined;
      });
      AND_Set = AND_Set.filter(function (element) {
        return element !== undefined;
      });
      let AvailableFromC;
      if (data.AvailableFrom) {
        AvailableFromC = moment(data.AvailableFrom).format("YYYY-MM-DD");
        AvailableFromC = `M.AvailableFrom <= '${AvailableFromC}' AND M.AvailableTo >= '${AvailableFromC}'`;
      } else {
        AvailableFromC = moment(new Date()).format("YYYY-MM-DD");
        AvailableFromC = `M.AvailableFrom <= '${AvailableFromC}' AND M.AvailableTo >= '${AvailableFromC}'`;
      }
      Table = await MealService.uniqueArray2(Table);
      let response = await sqlQ.joinQuery(
        `SELECT M.MealID,M.MealDesc,M.DTimeTo,M.ChefID,M.IsPublished,M.TotalSum,M.TotalDiscocunt,M.TotalSumAfterDiscount,
          M.AvailableFrom,M.AvailableTo,M.LeadTime,M.DelType,c.CuisineType,pt.ProductType,dm.DietaryReq,M.CuisineTypeID,M.MealTypeID,M.DietaryTypeID,
          M.DelKm, M.ModifiedOn,M.DelTimeFrom,M.DelTimeTo,M.CancelLeadHours,M.DelFee,M.MealName
          ,U.Country,U.State,U.Postcode,U.ProfileName,U.ImgProfile,U.MyStory,(select isnull(sum(R.Rating)/count(R.Rating), 0) from tbl_Ratings R where M.MealID = R.MealID) as AverageRating,
          (select isnull(count(R.Rating), 0) from tbl_Ratings R where M.MealID = R.MealID) as AverageReviewComment,
          (select isnull(sum(PL.SpiceLvl)/count(PL.SpiceLvl), 0)  from
             tbl_MealProducts MPL,tbl_Products PL, tblADM_CuisineMaster c ,tblADM_ProductType pt,tblADM_DietaryMaster dm
            WHERE MPL.MealID = M.MealID AND MPL.ProductID = PL.ProductID) as SpiceLvl
            ${UserID
          ? `,(select F.isFav from
              tbl_Favourites F
              WHERE F.MealID = M.MealID AND  F.ChefID = M.ChefID AND F.CustomerID = ${UserID}) as isFav,
              (select F.isFav from
                tbl_Favourites F
                WHERE F.MealID IS NULL AND  F.ChefID = M.ChefID AND F.CustomerID = ${UserID}) as isFavProfile`
          : ``
        } 
          from  ${Table.join(",")}
          WHERE
           ${AND_Set.join(" AND ")} AND U.UserID = M.ChefID AND M.CuisineTypeID = c.CuisineTypeID AND  M.MealTypeID = pt.ProductTypeID AND M.DietaryTypeID = dm.DietaryReqID  ${AvailableFromC ? `AND ${AvailableFromC}` : ``
        }  ${OR_Set.length ? `AND (${OR_Set.join(" AND ")})` : ``}
           group by M.MealID,M.MealDesc,M.DTimeTo,M.ChefID,M.IsPublished,M.TotalSum,M.TotalDiscocunt,M.TotalSumAfterDiscount,
           M.AvailableFrom,M.AvailableTo,M.LeadTime,M.DelType,c.CuisineType,pt.ProductType,dm.DietaryReq,M.CuisineTypeID,M.MealTypeID,M.DietaryTypeID,
           M.DelKm, M.ModifiedOn,M.DelTimeFrom,M.DelTimeTo,M.CancelLeadHours,M.DelFee,M.MealName
           ,U.Country,U.State,U.Postcode,U.ProfileName,U.ImgProfile,U.MyStory
        ORDER BY M.ModifiedOn DESC
        OFFSET ${offSet} ROWS FETCH NEXT ${limit} ROWS ONLY
    `);
      for (let i in response.recordset) {
        response.recordset[ i ].isFav = response.recordset[ i ].isFav
          ? response.recordset[ i ].isFav
          : false;
        response.recordset[ i ].isFavProfile = response.recordset[ i ].isFavProfile
          ? response.recordset[ i ].isFavProfile
          : false;
        let MealImages = await sqlQ.joinQuery(
          `select MI.MealID,MI.MealImgID,MI.MealImg,MI.IsCover  from  tbl_Meal M , tbl_MealImages MI WHERE MI.MealID = M.MealID AND M.MealID = ${response.recordset[ i ].MealID} ;`
        );
        response.recordset[ i ].MealImages = MealImages.recordset;
      }

      // let searchData = {
      //   SearchedOn: moment(new Date()).format(),
      //   CustomerID: UserID ? Number(UserID) : 0,
      // };
      // if (query?.lat !== 'undefined' && query?.long !== 'undefined')
      //   if (query?.lat && query.long) {
      //     searchData = { ...searchData, GeoLoc: `geography::STGeomFromText('POINT(${query?.lat} ${query.long})',4326)` };
      //   }
      // keys1.map((value) => {
      //   if (value === "MealName") {
      //     searchData = { ...searchData, Keyword: Condition[ value ] };
      //   } else if (value === "DelType") {
      //     searchData = { ...searchData, DelType: Condition[ value ] };
      //   } else if (value === "MealType") {
      //     searchData = { ...searchData, MealType: Condition[ value ] };
      //   } else if (value === "CuisineID") {
      //     searchData = { ...searchData, CuisineType: Condition[ value ] };
      //   } else if (value === "DietaryType") {
      //     searchData = { ...searchData, DietaryType: Condition[ value ] };
      //   } else if (value === 'LocalityId') {
      //     searchData = { ...searchData, LocalityID: Number(Condition[ value ]) };
      //   }
      // });
      // await sqlQ.create(
      //   "tbl_Search",
      //   { ...searchData },
      //   "SearchID"
      // );


      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getAllMealByChefID(id, query) {
    try {
      let limit = query.limit ? query.limit : 100000;
      let offSet = query.page ? query.page * limit : 0;
      let response = await sqlQ.joinQuery(`
      SELECT M.*,c.CuisineType,pt.ProductType,dm.DietaryReq,(select count(*) from tbl_Order O,tbl_Cart tc  where O.status = 'Accept' AND tc.CartID = O.CartID AND tc.MealID = M.MealID) as ActiveOrderCount,
      (select isnull(sum(R.Rating)/count(R.Rating), 0) from tbl_Ratings R where M.MealID = R.MealID) as AverageRating 
      FROM tbl_Meal M ,tblADM_CuisineMaster c ,tblADM_ProductType pt,tblADM_DietaryMaster dm WHERE M.ChefID = '${id}' AND M.IsDeleted = '0' AND M.CuisineTypeID = c.CuisineTypeID AND  M.MealTypeID = pt.ProductTypeID AND M.DietaryTypeID = dm.DietaryReqID 
      ORDER BY M.ModifiedOn DESC
      OFFSET ${offSet} ROWS FETCH NEXT ${limit} ROWS ONLY`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async checkExitUser(data) {
    try {
      return await database.User.count({
        where: {
          [ Op.or ]: [ { email: data.email }, { phone: data.email } ],
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
      let WhereCondition = `MealID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_Meal",
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

  static async findById(id, UserID) {
    try {

      let response = await sqlQ.joinQuery(
        `SELECT DISTINCT M.MealID,M.MealDesc,M.DTimeTo,M.ChefID,M.IsPublished,M.TotalSum,M.TotalDiscocunt,M.TotalSumAfterDiscount,
        M.AvailableFrom,M.AvailableTo,M.LeadTime,M.DelType,c.CuisineType,pt.ProductType,dm.DietaryReq,M.CuisineTypeID,M.MealTypeID,M.DietaryTypeID,
        M.DelKm, M.ModifiedOn,M.DelTimeFrom,M.DelTimeTo,M.CancelLeadHours,M.DelFee,M.MealName
        ,(select isnull(sum(R.Rating)/count(R.Rating), 0) from tbl_Ratings R where '${id}' = R.MealID) as AverageRating,
          (select isnull(count(R.Rating), 0) from tbl_Ratings R where '${id}' = R.MealID) as AverageReviewComment,
          (select F.isFav from tbl_Favourites F where F.MealID = '${id}' AND  F.ChefID = M.ChefID AND F.CustomerID = '${Number(
          UserID
        )}') as isFav
          from  tbl_Meal M ,tblADM_CuisineMaster c ,tblADM_ProductType pt,tblADM_DietaryMaster dm
          WHERE
           M.MealID = '${id}' AND M.CuisineTypeID = c.CuisineTypeID AND  M.MealTypeID = pt.ProductTypeID AND M.DietaryTypeID = dm.DietaryReqID 
           group by M.MealID,M.MealDesc,M.DTimeTo,M.ChefID,M.IsPublished,M.TotalSum,M.TotalDiscocunt,M.TotalSumAfterDiscount,
           M.AvailableFrom,M.AvailableTo,M.LeadTime,M.DelType,c.CuisineType,pt.ProductType,dm.DietaryReq,M.CuisineTypeID,M.MealTypeID,M.DietaryTypeID,
           M.DelKm, M.ModifiedOn,M.DelTimeFrom,M.DelTimeTo,M.CancelLeadHours,M.DelFee,M.MealName;`
      );
      if (response) {
        response.recordset[ 0 ].isFav = response.recordset[ 0 ].isFav
          ? true
          : false;

        let CommentDataList = await sqlQ.joinQuery(
          `select R.Rating,R.ReviewComments,R.CustomerID,R.UpdateOn from tbl_Ratings R where '${id}' = R.MealID ORDER BY R.UpdateOn DESC;`
        );
        response.recordset[ 0 ].CommentDataList = CommentDataList.recordset;

        let MealImages = await sqlQ.joinQuery(
          `select MI.MealID,MI.MealImgID,MI.MealImg,MI.IsCover  from  tbl_Meal M , tbl_MealImages MI WHERE MI.MealID = M.MealID AND M.MealID = ${id} ;`
        );
        response.recordset[ 0 ].MealImages = MealImages.recordset;
        let ProductData = await sqlQ.joinQuery(
          `select MP.MealID,MP.NewProductPrice,MP.OrgProductPrice,P.ProductID,P.ChefID,P.ProductName,P.ServeSizeID,P.QuantityML,P.Pieces,P.Price,P.Description,P.SpiceLvl,P.ProfileName
          from  tbl_Meal M , tbl_MealProducts MP,tbl_Products P WHERE MP.MealID = M.MealID AND MP.ProductID = P.ProductID  AND M.MealID = ${id};`
        );
        response.recordset[ 0 ].ProductData = ProductData.recordset
          ? ProductData.recordset
          : [];
        for (let i in response.recordset[ 0 ].ProductData) {
          let ingredientData = await sqlQ.joinQuery(
            `select i.ProductID,i.IngredientID,p.IngredientName  from  tbl_ProductsIngredients i , tblADM_IngredientsMaster p where i.IngredientID = p.IngredientsID AND i.ProductID = ${response.recordset[ 0 ].ProductData[ i ].ProductID} ;`
          );
          response.recordset[ 0 ].ProductData[ i ].IngredientData =
            ingredientData.recordset;
        }
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
      let WhereCondition = `MealID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_Meal",
        { IsDeleted: 1 },
        WhereCondition
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MealService;
