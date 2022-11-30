var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://home-dine-79c44-default-rtdb.firebaseio.com",
});

const options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

const sendPushNotification = (data) => {
  admin
    .messaging()
    .sendToDevice(data.deviceId, data.payload, options)
    .then(function (response) {
      if (response) {
        console.log("Successfully sent message:", response);
      } else {
        console.log("Error", response);
      }
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
};

module.exports = {
  sendPushNotification,
};
