const leadsModal = require("../models/leads");
const mailer = require("../../utils/mailer");
const htmlContent = require("../../constants/mailer/htmlContents");
const subjects = require("../../constants/mailer/subjects");

module.exports = {
  create: function (req, res, next) {
    leadsModal.findOne({ email: req.body.email }, function (err, usersInfo) {
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
          leadsModal.create(
            {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              department: req.body.department,
              location: req.body.location,
              role: "Lead",
            },
            function (err, result) {
              if (err) {
                next(err);
              } else {
                let { email } = req.body;
                //   TODO: add cc & bcc
                mailer.sendMail(
                  htmlContent.leadInvitation,
                  email,
                  email,
                  email,
                  subjects.invitation.lead
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
    });
  },

  getAll: function (req, res, next) {
    let leadList = [];
    leadsModal
      .find({})
      .sort({ firstName: 1 })
      .exec((err, leads) => {
        if (err) {
          next(err);
        } else {
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
            data: { leads: leadList },
          });
        }
      });
  },

  updateById: function (req, res, next) {
    leadsModal.findByIdAndUpdate(
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
    leadsModal.findByIdAndRemove(req.params.id, {}, function (err, result) {
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
