const crypto = require("crypto");
var CryptoJS = require("crypto-js");

const key = "06f3gk1185gzc70f6ucee1jua1714t7d78gplufaxz4ff0qw";
const algorithm = "aes-256-ctr";

const generateUUID = (length = 16, options = { numericOnly: false }) => {
  let text = "";
  const possible =
    options && options.numericOnly
      ? "0123456789"
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const generateUUID1 = (length) => {
  let text = "";
  const possible ="0123456789";

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

const compare = (encryptedText, text) => {
  var decrypted = CryptoJS.AES.decrypt(encryptedText, key).toString(
    CryptoJS.enc.Utf8
  );

  return text == decrypted;
};

const decrypt = (encryptedText) => {
  return CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
};

// const encrypt = (text) => {
//     const cipher = crypto.createCipher(algorithm, key);
//     let crypted = cipher.update(text, 'utf8', 'hex');
//     crypted += cipher.final('hex');
//     return crypted;
// };

// const decrypt = (text) => {
//     const decipher = crypto.createCipher(algorithm, key);
//     let dec = decipher.update(text, 'hex', 'utf8');
//     dec += decipher.final('utf8');
//     return dec;
// };

const encryptiv = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
};

const decryptiv = (text) => {
  const decipher = crypto.createCipheriv(algorithm, key, iv);
  let dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
};

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const capitalize = (val) => {
  if (typeof val !== "string") val = "";
  return val.charAt(0).toUpperCase() + val.substring(1);
};

const getNotificationDescription = (status) => {
  let dec = "";
  if (String(status).trim() === "Pending") {
    dec = "New Order Created";
  } else if (String(status).trim() === "Accept") {
    dec = `Order Accepted`;
  } else if (String(status).trim() === "Reject") {
    dec = "Order Rejected";
  } else if (String(status).trim() === "Cancel") {
    dec = "Order Cancelled";
  } else if (String(status).trim() === "dispatch") {
    dec = "Order Delivered";
  } else if (String(status).trim() === "success") {
    dec = "Order Confirmed";
  }
  return dec;
};

module.exports = {
  generateUUID,
  generateUUID1,
  getNotificationDescription,
  onlyUnique,
  encrypt,
  decrypt,
  compare,
  capitalize,
  encryptiv,
  decryptiv,
};
