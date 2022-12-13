require("dotenv").config();
const mailer = {
  user: process.env.adminEmail || "dev020.rejoice@gmail.com",
  pass: process.env.password || "123",
  email: process.env.email || "pkakabari22@gmail.com",
};
const azureStorageConfig = {
  accountName: process.env.accountName || "homechef",
  accountKey:
    process.env.accountKey ||
    "dIVeVt+AwQ5v4EdG31PP8KYmDoBEQZVnrKgemgfRakFp8DdX35MMd/qF7o+crtmxl2xcNBREjSMSrNz+T7JWcw==",
  blobURL: process.env.blobURL || "https://homechef.blob.core.windows.net/",
};
module.exports = {
  azureStorageConfig,
  mailer,
};
