require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var sql = require("mssql");
var dbConfig = require("./dbConnection");
var router = express.Router();

const app = express();
app.use(express.json());

// CORS Middleware
app.use(cors({ origin: true }));

app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1000mb" }));

const http = require("http").Server(app);

// var models = require("./api/server/models");

// models.sequelize
//   .sync()
//   .then(function () {
//     console.log("Connected !");
//   })
//   .catch(function (err) {
//     console.log(err, "something went wrong !");
//   });

const allRoutes = require("./api/server/routes");

// routes setup
function setupRoutes() {
  const routes = allRoutes;
  routes.setup(app);
}
setupRoutes();

/* Get All Students */
router.get("/test-route", function (req, res) {
  const result = sql.query("SELECT * FROM tbl_UserProfile;");

  return res.status(500).send(result);
});

// when a random route is inputed
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to this API.",
  })
);

app.get("/test", (req, res) =>
  res.status(200).send({
    message: "Welcome to this API.",
  })
);

const port = process.env.PORT || 8000;
// const port = 8000;

// http.listen(process.env.PORT, () => {
//   console.log(`Server is now running on http://localhost:${port}`);

// });

// Connect to sql database and start server
sql.connect(dbConfig.dbConnection()).then(() => {
  setupRoutes();
  http.listen(process.env.PORT, () => {
    console.log("Listening on port " + process.env.PORT);
  });
});

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});

function setupSocket() {
  const routes = require("./api/server/socket/index");
  routes.setup(io);
}
setupSocket();

module.exports = app;
