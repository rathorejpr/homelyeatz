const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery

class FeesService {

    static async add(data) {
        try {
            let response = await sqlQ.create("tbl_Feedback", { ...data }, "FeedbackID");
            let WhereCondition = `FeedbackID = '${response.recordset[ 0 ].FeedbackID}'`;
            response = await sqlQ.findByID("tbl_Feedback", WhereCondition);
            return response?.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async getAllFeedbackQuality() {
        try {
            const response = await sqlQ.getAll('tblADM_FeedbackQualityMaster')
            return response
        } catch (error) {
            throw error;
        }
    }

    static async getAllFeedbackFeeling() {
        try {
            const response = await sqlQ.getAll('tblADM_FeedbackFeelingMaster')
            return response
        } catch (error) {
            throw error;
        }
    }

    static async updateProductRating(id) {
        try {
            let WhereCondition = `ProductID = '${id}'`;
            let response = await sqlQ.findByIDAndUpdate(
                "tbl_ProductRating",
                { IsCurrent: 0 },
                WhereCondition
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async getAlreadyExistFeedback(body) {
        try {
            let WhereCondition = `ChefID = '${body.ChefID}' AND OrderID = '${body.OrderID}' AND DinerID = '${body.DinerID}' AND ProductID = '${body.ProductID}'`;
            let response = await sqlQ.findByID(
                "tbl_Feedback",
                WhereCondition
            );
            return response.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async addProductRating(data) {
        try {
            let response = await sqlQ.create("tbl_ProductRating", { ...data }, "ProductRatingID");
            let WhereCondition = `ProductRatingID = '${response.recordset[ 0 ].ProductRatingID}'`;
            response = await sqlQ.findByID("tbl_ProductRating", WhereCondition);
            return response?.recordset;
        } catch (error) {
            throw error;
        }
    }


    static async updateChefRating(id) {
        try {
            let WhereCondition = `ChefID = '${id}'`;
            let response = await sqlQ.findByIDAndUpdate(
                "tbl_ChefRating",
                { IsCurrent: 0 },
                WhereCondition
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async addChefRating(data) {
        try {
            let response = await sqlQ.create("tbl_ChefRating", { ...data }, "ChefRatingID");
            let WhereCondition = `ChefRatingID = '${response.recordset[ 0 ].ChefRatingID}'`;
            response = await sqlQ.findByID("tbl_ChefRating", WhereCondition);
            return response?.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async getChefCountForFeedback(chefID) {
        try {
            let response = await sqlQ.joinQuery(`SELECT COUNT(*) as count
            FROM tbl_Feedback where ChefID = '${chefID}';`);
            return response?.recordset[ response?.recordset?.length - 1 ]?.count;
        } catch (error) {
            throw error;
        }
    }

    static async getQualityIDSum(chefID) {
        try {
            let response = await sqlQ.joinQuery(`SELECT SUM(QualityID) as sumQualityID
            FROM tbl_Feedback where ChefID = '${chefID}';`);
            return response?.recordset[ response?.recordset?.length - 1 ]?.sumQualityID;
        } catch (error) {
            throw error;
        }
    }

    static async getFeelingIDSum(chefID) {
        try {
            let response = await sqlQ.joinQuery(`SELECT SUM(FeelingID) as sumFeelingID
            FROM tbl_Feedback where ChefID = '${chefID}';`);
            return response?.recordset[ response?.recordset?.length - 1 ]?.sumFeelingID;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = FeesService;
