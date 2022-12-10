const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

async function sendMail(htmlContent, to, cc, bcc, subject) {
  try {
    let info = await transporter.sendMail({
      from: "champions.neosoft@gmail.com", // sender address
      to: to,
      cc: cc, // list of receivers,
      bcc: bcc,
      subject: subject, // Subject line
      html: htmlContent, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    throw err;
  }
}

module.exports = { sendMail };
