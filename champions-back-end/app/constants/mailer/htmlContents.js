const APP_URL = require("../envConstants");
const htmlContent = {
  leadInvitation: `<h4>Invited to join as a Lead</h4><p>Please click on the below link to register as a lead in champions</p><a href=${APP_URL}signUp>${APP_URL}signUp</a><p>Regards,</p><p>Neosoft Technologies</p>`,
  championInvitation: `<h4>Invited to join as a champion</h4><p>Please click on the below link to register as a champion in champions</p><a href=${APP_URL}signUp>${APP_URL}signUp</a><p>Regards,</p><p>Neosoft Technologies</p>`,
};

module.exports = htmlContent;
