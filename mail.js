import nodemailer from 'nodemailer'

import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import 'dotenv/config'



function setmail() {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.password
    }
  });
  return (transporter)
}

function sendmail(email, name, transporter) {
  var mailOptions = {
    from: 'velurelleofficial@gmail.com',
    to: email,
    subject: 'Account Successfully Created',
    html: '<img src="cid:email-img"/>' + '<p style=" color: gray; font-size: 18px; text-align: center;"> Welcome To </p>' + '<h1 style=" color: black; font-size: 35px; text-align: center;"> Velurelle </h1>' + name + '<p> Your account has been successfully created. Log in to shop the new collection, build your saved items list, and manage your profile </p>' + '<p style="font-size: 12px;"><a href="http://localhost:8080/">Shop Now</a></p>',
    attachments: [{
      filename: 'email-img.jpeg',
      path: __dirname +'\\\public\\\image\\\email-img.jpeg',
      cid: 'email-img'
    }]
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export { setmail, sendmail }