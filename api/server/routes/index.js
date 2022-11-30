const config = require("../../../config");

require("dotenv").config();
exports.setup = function (app) {
  console.log("Setting up routes.");

  // https://jwt.io/introduction/
  const jwt = require("express-jwt");

  app.use(
    "/api/",
    (req, res, next) => {
      // console.log("req.originalUrl", req.originalUrl);
      // console.log("req.headers", req.headers);
      // console.log("req.body", req.body);
      // console.log("req.params", req.params);
      next();
    },
    jwt({
      secret: config.jwtSecret,
    }).unless({
      path: [
        "/api/user/signup",
        "/api/user/login",
        "/api/user/getTermsAndConditions",
        "/api/user/ChangePassword",
        "/api/user/forgatePassword",
        "/api/user/resetpassword",
        "/api/recipe/getAll",
        "/api/cusine/getAll",
        "/api/producttype/getAll",
        "/api/recipe/getProduct",
        "/api/recipe/searchProductByUser",
        "/api/meal/getAll",
        "/api/dietary/getAll",
        "/api/meal",
        "/api/meal/getminandmaxkm",
        "/api/recipe",
        "/api/meal/searchMealByUser",
        "/api/footer",
        "/api/contact/dropMail",
        "/api/about",
        "/api/wallpaper/getAll",
        "/api/user/getAllLocation",
        "/api/geoloc/searchGeoLoc",
        { url: /^\/api\/geoloc\/searchGeoLoc\/.*/, methods: [ 'GET' ] },
        { url: /^\/api\/geoloc\/getById\/.*/, methods: [ 'GET' ] },
        "/api/geoloc/getAll"
      ],
    })
  );

  const User = require("./user");
  const Superadmin = require("./superadmin");
  const Product = require("./product");
  const Meal = require("./meal");
  const Footer = require("./footer");
  const Contact = require("./contact");
  const About = require("./about");
  const Wallpaper = require("./wallpaper");
  const Cusine = require("./cusine");
  const DietaryMaster = require("./DietaryMaster");
  const Fees = require("./fees");
  const FeeType = require("./feeType");
  const GeoLoc = require("./geoLoc");
  const Ingredients = require("./ingredients");
  const ProductDetailsType = require("./productDetailsType");
  const ProductType = require("./productType");
  const UserType = require("./userType");
  const FoodHandlingCert = require("./foodhandlingcert");
  const MealTYpe = require("./mealtype");
  const DelType = require("./delType");
  const Cart = require("./cart");
  const Order = require("./order");
  const Favourite = require("./favourite");
  const Ratings = require("./ratings");
  const Business = require("./business");
  const Feedback = require("./feedback");

  app.use("/api/user", User);
  app.use("/api/superadmin", Superadmin);
  app.use("/api/recipe", Product);
  app.use("/api/meal", Meal);
  app.use("/api/cart", Cart);
  app.use("/api/footer", Footer);
  app.use("/api/contact", Contact);
  app.use("/api/about", About);
  app.use("/api/wallpaper", Wallpaper);
  app.use("/api/cusine", Cusine);
  app.use("/api/dietary", DietaryMaster);
  app.use("/api/fees", Fees);
  app.use("/api/feetype", FeeType);
  app.use("/api/geoloc", GeoLoc);
  app.use("/api/ingredients", Ingredients);
  app.use("/api/productdetailstype", ProductDetailsType);
  app.use("/api/producttype", ProductType);
  app.use("/api/usertype", UserType);
  app.use("/api/foodhandlingcert", FoodHandlingCert);
  app.use("/api/MealType", MealTYpe);
  app.use("/api/DelType", DelType);
  app.use("/api/order", Order);
  app.use("/api/favourite", Favourite);
  app.use("/api/ratings", Ratings);
  app.use("/api/business", Business);
  app.use("/api/feedback", Feedback);
};

module.exports = exports;
