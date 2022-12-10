const championModal = require("../models/champion");
const htmlContent = require("../../constants/mailer/htmlContents");
const subjects = require("../../constants/mailer/subjects");
const mailer = require("../../utils/mailer");

module.exports = {
  create: function (req, res, next) {
    championModal.findOne(
      { leadEmail: req.body.leadEmail, email: req.body.email },
      function (err, usersInfo) {
        if (err) {
          next(err);
        } else {
          if (usersInfo) {
            res.status(400).json({
              status: "Error",
              message: "Email already exist",
              data: null,
            });
          } else {
            championModal.create(
              {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                department: req.body.department,
                leadEmail: req.body.leadEmail,
                location: req.body.location,
                role: "champion",
              },
              function (err, result) {
                if (err) {
                  next(err);
                } else {
                  let { email } = req.body;
                  mailer.sendMail(
                    htmlContent.championInvitation,
                    email,
                    email,
                    email,
                    subjects.invitation.champion
                  );
                  res.json({
                    status: "success",
                    message: "User created successfully!!!",
                    data: null,
                  });
                }
              }
            );
          }
        }
      }
    );
  },

  getAll: function (req, res, next) {
    let leadList = [];
    championModal
      .find({ leadEmail: req.query.leadEmail })
      .sort({ firstName: 1 })
      .exec((err, leads) => {
        if (err) {
          next(err);
        } else {
          if (leads.length) {
            for (let lead of leads) {
              leadList.push({
                id: lead._id,
                firstName: lead.firstName,
                lastName: lead.lastName,
                department: lead.department,
                email: lead.email,
                location: lead.location,
              });
            }
            res.json({
              status: "Success",
              message: "Get all leads !!!",
              data: { champions: leadList },
            });
          } else {
            res.status(400).json({
              status: "Error",
              message: "No data available !!!",
              data: null,
            });
          }
        }
      });
  },

  getTeam: function (req, res, next) {
    let teamList = [];
    championModal
      .find({ email: req.query.email })
      .sort({ firstName: 1 })
      .exec((err, champ) => {
        if (err) {
          next(err);
        } else {
          if (champ.length) {
            championModal.find(
              { leadEmail: champ[0].leadEmail },
              function (err, leads) {
                if (err) {
                  next(err);
                } else {
                  if (leads.length) {
                    for (let lead of leads) {
                      teamList.push({
                        id: lead._id,
                        firstName: lead.firstName,
                        lastName: lead.lastName,
                        department: lead.department,
                        email: lead.email,
                        location: lead.location,
                        leadEmail: champ[0].leadEmail,
                      });
                    }
                    res.json({
                      status: "Success",
                      message: "Get all leads !!!",
                      data: { champions: teamList },
                    });
                  } else {
                    res.status(400).json({
                      status: "Error",
                      message: "No data available !!!",
                      data: null,
                    });
                  }
                }
              }
            );
          } else {
            res.status(400).json({
              status: "Error",
              message: "No data available !!!",
              data: null,
            });
          }
        }
      });
  },

  updateById: function (req, res, next) {
    championModal.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        location: req.body.location,
        department: req.body.department,
      },
      function (err, result) {
        if (err) {
          next(err);
        } else {
          if (result) {
            res.json({
              status: "Success",
              message: "Updated successfully !!!",
              data: result,
            });
          } else {
            res.status(400).json({
              status: "Error",
              message: "No record found",
              data: result,
            });
          }
        }
      }
    );
  },

  deleteById: function (req, res, next) {
    championModal.findByIdAndRemove(req.params.id, {}, function (err, result) {
      if (err) {
        next(err);
      } else {
        if (result) {
          res.json({
            status: "Success",
            message: "Deleted Succesfully !!!",
            data: result,
          });
        } else {
          res.status(400).json({
            status: "Error",
            message: "No record found",
            data: result,
          });
        }
      }
    });
  },
};
