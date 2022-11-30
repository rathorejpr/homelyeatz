"use strict";

const { ObjectId } = require("bson");
const CartService = require("../services/cart");
const OrderService = require("../services/order");
const { sendPushNotification } = require("../utils/pushnotification");
const { getNotificationDescription } = require("../utils/util");
const SqlQuery = require("../services/sqlqueries");
const STATUS = require("../utils/constants");
const schedule = require("node-schedule");
const moment = require("moment");
const UserService = require("../services/user");
var sqlQ = new SqlQuery();
const activeUsers = new Set();
// const stripe = require("stripe")("sk_test_51Iloh1SFrICIu0SNb3NCdbqXXu2GCBVvJj8gJV2S8yay2lC4yaIS2h3i8CKfkRik0GQbErWcTXu5SVt3fH8pWiu900167hNghI");
var Publishable_Key =
  "pk_test_51Iloh1SFrICIu0SNdlucWSqMdOuyudKQsS3GNbbpVTMislTGvseZkkfF5XqcolFb2nlSQZftotMhgaqvGpb6N39Y00wE3iXfqh";
var Secret_Key =
  "sk_test_51Iloh1SFrICIu0SNb3NCdbqXXu2GCBVvJj8gJV2S8yay2lC4yaIS2h3i8CKfkRik0GQbErWcTXu5SVt3fH8pWiu900167hNghI";
const stripe = require("stripe")(Secret_Key);
// const { CloudFormation } = require("aws-sdk");
exports.setup = function (io) {
  io.on("connection", (socket) => {
    console.log("a user is connected", socket.id);

    socket.on("join", async function ({ UserID, UserType }) {
      socket.UserID = Number(UserID);
      activeUsers.add(Number(UserID));
      socket.join(Number(UserID));
      try {
        let UserID1 = Number(UserID);
        let OrderData = [];
        if (Number(UserType) === 2) {
          OrderData = await OrderService.getOrderByChef(UserID1);
        } else if (Number(UserType) === 3) {
          OrderData = await OrderService.getOrderByUser(UserID1);
        }
        io.in(socket.id).emit("history", { Order: OrderData.recordset });
      } catch (error) {
        console.log("Error in sending message", error);
      }
    });

    socket.on("placeOrder", async function ({ CartID, UserID, UserType }) {
      try {
        let OrderData = [];
        let body = {
          status: STATUS[ 0 ],
          UserID: Number(UserID),
          CreatedOn: moment().format(),
          ModifiedOn: moment().format(),
          CreatedBy: UserID,
          ModifiedBy: UserID,
        };
        let response = [];
        const Notificationsresponse = await sqlQ.joinQuery(`SELECT N.*
        from  tblADM_Notifications N
        WHERE Noticication = 'OrderAcceptance' 
        `);
        for (let i in CartID) {
          let response1 = await OrderService.add({
            ...body,
            CartID: Number(CartID[ i ]),
          });
          await CartService.update({ IsActive: 0 }, Number(CartID[ i ]));
          response.push(response1.recordset[ 0 ]);
          if (
            Notificationsresponse &&
            Notificationsresponse.recordset &&
            Notificationsresponse.recordset.length
          ) {
            const event = schedule.scheduleJob(
              `*/${Notificationsresponse.recordset[ 0 ].Minutes} * * * *`,
              async function () {
                let GetOrderData =
                  await OrderService.getByOrderIDWithPendingStatus(
                    response1.recordset[ 0 ]
                  );
                if (GetOrderData.length) {
                  let orderId = response1.recordset[ 0 ].OrderID;
                  let dataUpdate = response1.recordset[ 0 ];
                  delete dataUpdate.OrderID;
                  response1.recordset[ 0 ].status = "Reject";
                  let UpdateOrderData = await OrderService.update(
                    dataUpdate,
                    orderId
                  );
                  if (
                    UpdateOrderData.recordset &&
                    UpdateOrderData.recordset.length
                  ) {
                    event.cancel();
                  }
                } else {
                  event.cancel();
                }
              }
            );
          }
        }
        for (let i in response) {
          let orderD = await OrderService.findByID(response[ i ].OrderID);
          OrderData.push(orderD.recordset[ 0 ]);
          io.in(Number(orderD.recordset[ 0 ].ChefID)).emit("placeOrder", {
            Order: orderD.recordset[ 0 ],
          });
          let UserData1 = await UserService.findById(
            orderD.recordset[ 0 ].ChefID
          );
          console.log(
            "orderD.recordset[0].ChefIDorderD.recordset[0].ChefID",
            orderD.recordset[ 0 ].ChefID
          );
          let data2 = {
            payload: {
              notification: {
                title: "Home Dine",
                body: `New Order Added`,
              },
              data: {
                type: "RESERVATION",
              },
            },
            deviceId: UserData1.recordset[ 0 ].Device_Token,
          };
          if (UserData1.recordset[ 0 ] && UserData1.recordset[ 0 ].Device_Token) {
            await sendPushNotification(data2);
          }
        }

        let UserData = await UserService.findById(UserID);
        let data = {
          payload: {
            notification: {
              title: "Home Dine",
              body: `${UserData.recordset[ 0 ].Name} Order SucessFully Created `,
            },
            data: {
              type: "RESERVATION",
            },
          },
          deviceId: UserData.recordset[ 0 ].Device_Token,
        };
        if (UserData.recordset[ 0 ] && UserData.recordset[ 0 ].Device_Token) {
          await sendPushNotification(data);
        }

        io.in(Number(UserID)).emit("placeOrder", { Order: OrderData });
        // return res.send({ data: "Failed", status: 500 })    // If some error occurs
      } catch (error) {
        console.log("Error in sending message", error);
      }
    });

    socket.on(
      "statusChange",
      async function ({ OrderID, status, UserID, UserType }) {
        try {
          await OrderService.update(
            { status: status, ModifiedBy: UserID, ModifiedOn: moment().format(), },
            OrderID
          );
          let orderD = await OrderService.findByID(OrderID);

          let desc = await getNotificationDescription(status);
          let UserData = await UserService.findById(orderD.recordset[ 0 ].UserID);
          let UserData1 = await UserService.findById(
            orderD.recordset[ 0 ].ChefID
          );
          if (Number(UserType) === 2) {
            let data = {
              payload: {
                notification: {
                  title: "Home Dine",
                  body: `${desc} ${UserData1.recordset[ 0 ].Name}.`,
                },
                data: {
                  type: "RESERVATION",
                },
              },
              deviceId: UserData.recordset[ 0 ].Device_Token,
            };
            if (UserData.recordset[ 0 ] && UserData.recordset[ 0 ].Device_Token) {
              await sendPushNotification(data);
            }
          } else if (Number(UserType) === 3) {
            let data2 = {
              payload: {
                notification: {
                  title: "Home Dine",
                  body: `${desc} ${UserData.recordset[ 0 ].Name}.`,
                },
                data: {
                  type: "RESERVATION",
                },
              },
              deviceId: UserData1.recordset[ 0 ].Device_Token,
            };
            if (UserData1.recordset[ 0 ] && UserData1.recordset[ 0 ].Device_Token) {
              await sendPushNotification(data2);
            }
          }

          io.in(Number(orderD.recordset[ 0 ].ChefID)).emit("statusChange", {
            statusUpdate: orderD.recordset[ 0 ],
          });
          io.in(Number(orderD.recordset[ 0 ].UserID)).emit("statusChange", {
            statusUpdate: orderD.recordset[ 0 ],
          });
        } catch (error) {
          console.log("Error in sending message", error);
        }
      }
    );

    socket.on("disconnect", function () {
      // console.log('disconnect', socket.userId)
      // activeUsers.delete(socket.userId);
      // io.emit("disconnect", socket.userId);
    });

    socket.on("error", function (err) {
      console.log("received error from socket:", socket.id);
      console.log(err);
    });
  });
};

module.exports = exports;
