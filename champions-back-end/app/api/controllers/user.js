const userModel = require("../models/user");
const leadModel = require("../models/leads");
const championModel = require("../models/champion");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var async = require("async");
var crypto = require("crypto");

async function userSignUp(req, res, next, err, result, userRole) {
  if (err) {
    next(err);
  } else {
    userModel.create(
      {
        name: result.firstName + " " + result.lastName,
        email: req.body.email,
        password: req.body.password,
        role: userRole,
      },
      function (err, result) {
        if (err) {
          next(err);
        } else {
          res.json({
            status: "success",
            message: "Signed up successfully!!!",
            data: null,
          });
        }
      }
    );
  }
}

module.exports = {
  create: function (req, res, next) {
    userModel.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      },
      function (err, result) {
        if (err) {
          next(err);
        } else {
          res.json({
            status: "success",
            message: "User created successfully!!!",
            data: null,
          });
        }
      }
    );
  },

  signUp: async function (req, res, next) {
    if (req.body.userRole == "lead") {
      leadModel.findOne({ email: req.body.email }, function (err, result) {
        // result = {
        //   firstName: "Sushant",
        //   lastName: "Kadam",
        //   email: req.body.email,
        //   password: req.body.password,
        //   role: req.body.role,
        // };
        // userSignUp(req, res, next, err, result, req.body.userRole); //changes
        if (!result) {
          res.status(400).send({
            status: "Error",
            success: false,
            message: "Email is not registered",
          });
        } else {
          userSignUp(req, res, next, err, result, req.body.userRole);
        }
      });
    } else if (req.body.userRole == "champion") {
      championModel.findOne({ email: req.body.email }, function (err, result) {
        if (!result) {
          res.status(400).send({
            status: "Error",
            success: false,
            message: "Email is not registered",
          });
        } else {
          userSignUp(req, res, next, err, result, req.body.userRole);
        }
      });
    }
  },

  authenticate: function (req, res, next) {
    
    userModel.findOne({ email: req.body.email }, function (err, userInfo) {
      if (err) {
        next(err);
      } else {
        if (!userInfo) {
          res.status(400).send({
            status: "Error",
            success: false,
            message: "Authentication failed. User not found.",
          });
          // res.status(400).json({status: "Error", message: "User not found!", data:null});
        } else if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign(
            { id: userInfo._id },
            req.app.get("secretKey"),
            { expiresIn: "10h" }
          );
          res.json({
            status: "success",
            message: "Loged in successfully!",
            data: userInfo,
            token: token,
          });
          // mailer().catch(console.error);
        } else {
          res.status(400).send({
            status: "Error",
            success: false,
            message: "Invalid email/password!!!",
          });
          // res.status(400).json({status: "Error", message: "Invalid email/password!!!", data:null});
        }
      }
    });
  },

  forgotPassword: function (req, res, next) {
    async.waterfall(
      [
        function (done) {
          crypto.randomBytes(20, function (err, buf) {
            var token = buf.toString("hex");
            done(err, token);
          });
        },
        function (token, done) {
          userModel.findOne({ email: req.body.email }, function (err, user) {
            if (!user) {
              res.status(400).send({
                status: "Error",
                success: false,
                message: "No account with that email address exists.",
              });
            } else {
              // user.resetPasswordToken = token;
              // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
              userModel.updateOne(
                { email: req.body.email },
                {
                  $set: {
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 3600000, // 1
                  },
                },
                (err) => {
                  done(err, token, user);
                }
              );
              // user.save(function (err) {
              //   done(err, token, user);
              // });
            }
          });
        },
        function (token, user, done) {
          let smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASS,
            },
          });
          var mailOptions = {
            to: user.email,
            from: "champions.neosoft@gmail.com",
            subject: "Password Reset for champions account",
            text:
              "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
              "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
              "http://" +
              "180.149.241.208:3027" +
              "/forgot-password/" +
              token +
              "\n\n" +
              "If you did not request this, please ignore this email and your password will remain unchanged.\n",
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            if (!err) {
              res.json({
                status: "success",
                message: "Please check your email for further details.",
                data: null,
              });
            }
            done(err, "done");
          });
        },
      ],
      function (err) {
        if (err) {
          return next(err);
          // console.log(err)
        }
      }
    );
  },

  resetPassword: function (req, res, next) {
    async.waterfall(
      [
        function (done) {
          userModel.findOne(
            {
              resetPasswordToken: req.params.token,
              resetPasswordExpires: { $gt: Date.now() },
            },
            function (err, user) {
              if (!user) {
                res.status(400).send({
                  status: "Error",
                  success: false,
                  message: "Password reset token is invalid or has expired.",
                });
              } else {
                user.password = req.body.password;
                user.resetPasswordToken = null;
                user.resetPasswordExpires = null;
                user.save(function (err) {
                  done(err, user);
                });
              }
            }
          );
        },
        function (user, done) {
          let smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASS,
            },
          });

          var mailOptions = {
            to: user.email,
            from: "champions.neosoft@gmail.com",
            subject: "Your password has been changed",
            text:
              "Hello,\n\n" +
              "This is a confirmation that the password for your account " +
              user.email +
              " has just been changed.\n",
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            res.json({
              status: "success",
              message: "Your password has been changed successfully!!!",
              data: null,
            });
            done(err);
          });
        },
      ],
      function (err) {
        res.redirect("/");
      }
    );
  },
};
