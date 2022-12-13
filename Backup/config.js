require("dotenv").config();

const jwtSecret =
  process.env.JWT_SECRET || "0a6b944d-d2fb-46fc-a85e-0295c986cd9f";

const mailer = {
  user: process.env.adminEmail || "dev020.rejoice@gmail.com",
  pass: process.env.password || "123",
  email: process.env.email || "pkakabari22@gmail.com"
}

module.exports = {
  jwtSecret,
  mailer
};