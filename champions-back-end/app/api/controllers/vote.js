const voteModal = require("../models/vote");
const championModal = require("../models/champion");

module.exports = {
  takeVote: function (req, res, next) {
    voteModal.findOne(
      { voterEmail: req.body.voterEmail },
      function (err, usersInfo) {
        if (err) {
          next(err);
        } else {
          if (usersInfo) {
            res.status(400).json({
              status: "Error",
              message: "Vote already given",
              data: null,
            });
          } else {
            championModal.findOne(
              { email: req.body.voterEmail },
              function (err, result) {
                if (err) {
                  next(err);
                } else {
                  voteModal.create(
                    {
                      firstName: req.body.firstName,
                      lastName: req.body.lastName,
                      email: req.body.email,
                      voterEmail: req.body.voterEmail,
                      voteDescription: req.body.voteReason,
                      leadEmail: req.body.leadEmail,
                      champId: result._id,
                      date: req.body.date,
                    },
                    function (err, result) {
                      if (err) {
                        next(err);
                      } else {
                        res.json({
                          status: "success",
                          message: "Vote added successfully!!!",
                          data: result,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  },

  getVoteDetails: async function (req, res, next) {
    let voteDetails = [];
    let voteCountArray = [];
    voteModal
      .find({ leadEmail: req.query.leadEmail })
      .populate("champId")
      .exec(function (err, champions) {
        if (err) {
          next(err);
        } else {
          let unique = [...new Set(champions.map((item) => item.email))];
          unique.forEach((email) => {
            var group = champions.filter((item) => {
              return item.email == email;
            });
            voteCountArray.push(group);
          });
          for (let vote of voteCountArray) {
            var obj = {
              championDetails: vote[0],
              voters: vote,
              votingCount: vote.length,
            };
            voteDetails.push(obj);
          }
          res.json({
            status: "Success",
            message: "Get all leads !!!",
            data: { champions: voteDetails },
          });
        }
      });
  },
};
