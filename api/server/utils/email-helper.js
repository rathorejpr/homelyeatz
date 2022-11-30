// require("dotenv").config();
// const EmailTemplates = require("swig-email-templates");
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.API_KEY);
const nodemailer = require("nodemailer");
const EmailTemplates = require("swig-email-templates");
const config = require("../config/config");
const sgMail = require("@sendgrid/mail");
const { env } = require("process");
sgMail.setApiKey(process.env.API_KEY);
const templates = new EmailTemplates({
  root: "api/server/views/emailers/",
  swig: {
    cache: false,
  },
});

async function sendMail(email, subjectName, mailTemplateName, mailData) {
  return new Promise(async (resolve, reject) => {
    templates.render(mailTemplateName, mailData, async (err, html) => {
      if (err) {
        // return new Error(err);
        reject(err);
      } else {
        const msg = {
          from: `${process.env.adminEmail}`,
          to: [ email ],
          subject: subjectName,
          html,
        };
        sgMail
          .send(msg)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject("Send mail error ", err);
          });
      }
    });
  });
}

// async function sendMail(email, subjectName, mailTemplateName, mailData) {
//   return new Promise(async (resolve, reject) => {
//     let data = JSON.stringify(mailData)
//     const msg = {
//       from: process.env.adminEmail,
//       to: [email],
//       subject: 'Hello from send grid',
//       text: data
//     }
//     sgMail.send(msg).then((res) => {
//       resolve(res);
//     })
//       .catch((err) => {
//         console.log(err);
//         reject("Send mail error ", err);
//       });

//   })
// };

module.exports = {
  sendMail,
};
