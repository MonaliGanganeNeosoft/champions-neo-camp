const cron = require("node-cron");
const express = require("express");
let nodemailer = require("nodemailer");
const championsModel = require("../models/champion");
const voteModal = require("../models/vote");
const championOfWeekModal = require("../models/championOfTheWeek");

module.exports = {
  nominateChampionCron: function (corn) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });

    //   sending emails at periodic intervals
    
    cron.schedule(corn, function () {
      let emailList = [];
      championsModel.find({}, function (err, res) {
        if (err) {
          next(err);
        } else {
          res.forEach(function (champ, i) {
            if (res.length - 1 > i) {
              // emailList += champ.email + ",";
              emailList.push(champ.email);//changes
            } else {
              // emailList += champ.email;
              emailList.push(champ.email);
            }
          });
          console.log(emailList);
        }
      });

      let mailOptions = {
        from: "champions.neosoft@gmail.com",
        // to: "abhijeet.kothawade@neosofttech.com," + emailList,
        to: emailList,
        subject: `Nominate your champion for this week.`,
        html: `<p>
                      <h5> 
                      Hi, </br> </br>
                      Good Morning, </br></br>
                      Greeting for the day, <br>
                      </h5>
                      <h5>
                          &nbsp;&nbsp;&nbsp;&nbsp; Hope you're doing good, this is the time to nominate your champion for this week. we request you to log in to your champion portal and nominate your team member to appreciate his/her work.
                      </h5>
                    <h5> 
                      Thanks & Regards,</br>
                      Neosoft technologies
                    </h5>
                  </p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          throw error;
        } else {
          console.log("Email successfully sent!");
        }
      });
    });
  },

  resetVoteCountAndAddChapionOfWeek: async function () {
    // cron.schedule("21 16 * * *", function () {
    cron.schedule("15 17 * * 4", function () {
      voteModal
        .find()
        .populate("champId")
        .exec(function (err, champions) {
          if (err) {
            next(err);
          } else {
            console.log(champions);
            let groupByLead = champions.reduce(function (r, a) {
              r[a.leadEmail] = r[a.leadEmail] || [];
              r[a.leadEmail].push(a);
              return r;
            }, Object.create(null));
            for (var key of Object.keys(groupByLead)) {
              let groupByNominee = groupByLead[key].reduce(function (r, a) {
                r[a.email] = r[a.email] || [];
                r[a.email].push(a);
                return r;
              }, Object.create(null));
              let nomineeData = [];
              for (var voteKey of Object.keys(groupByNominee)) {
                let obj = {
                  nominee: groupByNominee[voteKey],
                  voteCount: groupByNominee[voteKey].length,
                };
                nomineeData.push(obj);
              }
              // let copyOfnomineeData = nomineeData.slice(0);
              let maximumVoteCount = nomineeData.reduce(function (
                prev,
                current
              ) {
                return prev.voteCount > current.voteCount ? prev : current;
              });

              let nomineesForTheWeek = nomineeData.filter(function (data) {
                return maximumVoteCount.voteCount == data.voteCount;
              });

              for (let nominee of nomineesForTheWeek) {
                championsModel.find(
                  { email: nominee.nominee[0].email },
                  async function (err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      championOfWeekModal.create(
                        {
                          status: false,
                          voteCount: nominee.voteCount,
                          champId: result[0]._id,
                          weekDate: nominee.nominee[0].date,
                          leadEmail: nominee.nominee[0].leadEmail,
                        },
                        async function (err, champions) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log(
                              "success : Champion for this week is selected!!!"
                            );
                            voteModal.remove({}, async function (err, data) {
                              if (err) {
                                console.log(err);
                              } else {
                                console.log(
                                  "removed all vote on friday 11:59:59"
                                );
                              }
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
        });
    });
  },
};
