const SuperAdminController = require("../controllers/superadmin");
const router = require("express").Router();

router.post("/addUserList", SuperAdminController.roleAdd);

module.exports = router;
