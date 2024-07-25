const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const sendEmail = (email,OTP) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user:process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
console.log("hey")

  async function main() {
    
    const info = await transporter.sendMail({
      from: `"Pitch Catalyst 👻" <${process.env.EMAIL_USER}>`, 
      to: email,
      subject: "Create your password ✔", 
      text: `Please verify your OTP`, 
      html:`<b>Hello, your OTP for verification is ${OTP}</b>` 
    });

    console.log("Message sent: %s", info.messageId);

  }

  main().catch(console.error);
};

module.exports = {sendEmail};
