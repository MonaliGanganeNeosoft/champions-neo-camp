const voteModal = require("../models/vote");
const championOfWeek = require("../models/championOfTheWeek");
const leadModle = require("../models/leads");
const championModle = require("../models/champion");
const nodemailer = require("nodemailer");

async function mailer(htmlContent, champoionsEmail, to, cc, bcc, subject) {
  // let testAccount = await nodemailer.createTestAccount()
  var championEmailList = "";
  champoionsEmail.forEach(function (champ, i) {
    if (champoionsEmail.length - 1 > i) {
      championEmailList += champ.email + ",";
    } else {
      championEmailList += champ.email;
    }
  });
  let tranporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.pass,
    },
  });

  let info = await tranporter.sendMail({
    from: "champions.neosoft@gmail.com", // sender address
    to: to,
    cc: championEmailList + "," + cc, // list of receivers,
    bcc: bcc,
    subject: subject, // Subject line
    html: htmlContent, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
  setChampionOfWeek: async function (req, res, next) {
    //    championOfWeek.find({weekDate: req.body.weekDate, leadEmail: req.body.leadEmail, champId: req.body.champId}, function(err, data){
    //        if (err) {
    //            next(err)
    //        } else {
    //            if (data.length) {
    //             res.status(400).json({status: "Error", message: "Champion for this week is already selected!!!", data: null});
    //            } else {
    championOfWeek.create(
      {
        status: req.body.status,
        voteCount: req.body.voteCount,
        champId: req.body.champId,
        weekDate: req.body.weekDate,
        leadEmail: req.body.leadEmail,
      },
      function (err, champions) {
        if (err) {
          next(err);
        } else {
          championModle.find(
            { leadEmail: req.body.leadEmail },
            function (err, champoionsEmail) {
              if (err) {
                next(err);
              } else {
                mailer(
                  req.body.htmlContent,
                  champoionsEmail,
                  req.body.to,
                  req.body.cc,
                  req.body.bcc,
                  req.body.Subject
                );
                res.json({
                  status: "Success",
                  message: "Mail sent successfully !!!",
                  data: null,
                });
              }
            }
          );
        }
      }
    );
    //            }
    //         }
    //    })
  },

  getChapionsOfWeek: async function (req, res, next) {
    championOfWeek
      .find({ leadEmail: req.query.leadEmail })
      .populate("champId")
      .exec(function (err, champions) {
        if (err) {
          next(err);
        } else {
          res.json({
            status: "Success",
            message: "Champion list !!!",
            data: champions,
          });
        }
      });
  },

  updateChapionsOfWeek: async function (req, res, next) {
    championOfWeek.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      function (err, champions) {
        if (err) {
          next(err);
        } else {
          if (champions) {
            mailer(req.body.htmlContent);
            res.json({
              status: "Success",
              message: "Updated successfully !!!",
              data: champions,
            });
          } else {
            res.status(400).json({
              status: "Error",
              message: "No record found",
              data: null,
            });
          }
        }
      }
    );
  },
};
