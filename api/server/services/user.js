const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sql = require("mssql");
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery();
const moment = require("moment");

class UserService extends SqlQuery {
  static async add(data) {
    try {
      let body = {
        ...data,
        IsDigitalVerified: 0,
        IsFoodHandlingVerified: 0,
        IsActive: 0,
        CreatedOn: moment(new Date()).format(),
        ModifiedOn: moment(new Date()).format(),
        CreatedBy: data.UserName,
        ModifiedBy: data.ModifiedBy,
      };
      let response = await sqlQ.create(
        "tbl_UserProfile",
        { ...body },
        "UserID"
      );
      if (response) {
        let orData = {
          Email: data.Email,
          Mobile: data.Mobile,
        };
        return await sqlQ.findByORQuery("tbl_UserProfile", { ...orData });
      } else {
        return false;
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  static async checkExitUser(data) {
    try {
      let orData = {
        Email: data.Email,
        Mobile: data.Mobile,
      };
      let andData = {
        UserType: data.UserType,
      };
      let response = await sqlQ.findByOR_ANDQuery(
        "tbl_UserProfile",
        { ...orData },
        { ...andData }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async find(data) {
    try {
      return await sqlQ.findByORQuery("tbl_UserProfile", { ...data });
    } catch (error) {
      throw error;
    }
  }

  static async findOne(data) {
    try {
      let orData = {
        Email: data.Email,
        Mobile: data.Email,
      };
      let andData = {
        UserType: data.UserType,
      };
      let response = await sqlQ.findByOR_ANDQuery(
        "tbl_UserProfile",
        { ...orData },
        { ...andData }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async updateData(data, id) {
    try {
      let WhereCondition = `UserID = '${id}'`;
      let response = await sqlQ.findByIDAndUpdate(
        "tbl_UserProfile",
        { ...data },
        WhereCondition
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      let WhereCondition = `UserID = '${id}'`;

      let response = await sqlQ.findByID("tbl_UserProfile", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async restPassword() {
    try {
      let WhereCondition = `UserID = '${id}'`;
      let response = await sqlQ.findByID("tbl_UserProfile", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      let response = sqlQ.getAll("tblADM_CountyState");
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findByProfileName(ProfileName, UserID) {
    try {
      let WhereCondition = `LOWER(ProfileName) = LOWER('${ProfileName}') AND UserID <> '${UserID}'`;
      let response = await sqlQ.findByID("tbl_UserProfile", WhereCondition);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getTermsAndConditions() {
    try {
      let response = await sqlQ.joinQuery(
        `SELECT *
        from  tblADM_TC
        WHERE ActiveFrom >= '${moment(new Date()).format("YYYY-MM-DD")}'`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
