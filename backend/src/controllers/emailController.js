const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/user");
 
const sendEmail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "resulcaliskansau@gmail.com", // buraya venhancer e-posta adresi gelecek
        pass: "boou obke qieo vnqe", // buraya venhancer  e-posta adresi için şifre oluşturulmalı
      },
    });
    const users = await User.findOne({ email: req.body.recipientEmail });
    const id = users._id;
    const mailToken = jwt.sign({ id }, config.secretKey, {
      expiresIn: "1d",
    });
 
    const mailOptions = {
      from: "resulcaliskansau@gmail.com",
      to: req.body.recipientEmail,
      subject: "Venhancer CRM",
      html: `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        integrity="sha384-mQ93GR66B00ZXjt0YO5KlohRA5SY2XofGJ6fR5P5X3ZqI1MvVrko/2+E+hTEIoS"
        crossorigin="anonymous"
      />
      <title>Venhancer CRM'e hoş geldiniz</title>
      <style>
       
      </style>
      </head>
      <body style= " font-family: Arial, sans-serif; width:70%;">
      <header style="background-color: #000000; color: white; text-align: left;">
        <h1 style="padding-left: 30px; padding-top: 20px; margin-bottom: 0;">HR Hub</h1>
         <h2 style="padding-left: 30px; margin-top: 0; margin-bottom:0;">CRM</h2>
      </header>
      <div style="
      background-color: #f5f5f5;
      padding-bottom: 20px;
      padding-top: 80px;
      padding-left: 60px;
      font-size: 16px;
      line-height: 1.5;
     ">
        <h3 style="margin-bottom: 5px;">
         HR HUB'a Hoşgeldin!
        </h3>
        <p style="margin-bottom: 10px; padding-top: 10px; font-size: medium">
         Kullanıcı Talebiniz Onaylanmıştır. HR HUB'a hoşgeldiniz. Web sitesini ziyaret etmek için aşağıdaki butona tıklayınız.
        </p>
        <a
          style="
            display: inline-block;
            padding: 5px;
            padding-inline-start: 30px;
            padding-inline-end: 30px;
            border-radius: 8px;
            background-color: #0057D9;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          "
          href="https://crm-daltonlar.vercel.app/set-password/${mailToken}"
          >HRHUB'ı Keşfet !
        </a>
        <p style="margin-bottom: 20px; padding-top: 60px; font-size: medium">
          Eğer bu mailin yanlış geldiğini düşünüyorsanız Lütfen Dikkate Almayınız
        </p>
      </div>
      <footer style="font-size: 12px; padding: 5px">
        Daltonlar Saygılar ve Sevgiler ile iyi Günler diler. Geçmiş olsun
        soyuldunuz :)
      </footer>
      </body>
      </html>
     
      `,
    };
 
    await transporter.sendMail(mailOptions);
 
    res.status(200).json({ message: "E-posta başarıyla gönderildi." });
  } catch (error) {
    console.error("E-posta gönderme hatası:", error);
    res.status(500).json({ error: "E-posta gönderme hatası." + error });
  }
};
 
const sendChangePasswordMail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "resulcaliskansau@gmail.com",
        pass: "boou obke qieo vnqe",
      },
    });
 
    const id = req.body.id;
    const mailToken = jwt.sign({ id }, config.secretKey, {
      expiresIn: "1d",
    });
 
    const mailOptions = {
      from: "resulcaliskansau@gmail.com",
      to: req.body.recipientEmail,
      subject: "CRM Şifre Yenileme",
      html: `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        integrity="sha384-mQ93GR66B00ZXjt0YO5KlohRA5SY2XofGJ6fR5P5X3ZqI1MvVrko/2+E+hTEIoS"
        crossorigin="anonymous"
      />
      <title>Venhancer CRM'e hoş geldiniz</title>
      <style>
       
      </style>
      </head>
      <body style= " font-family: Arial, sans-serif; width:70%;">
      <header style="background-color: #000000; color: white; text-align: left;">
        <h1 style="padding-left: 30px; padding-top: 20px; margin-bottom: 0;">HR Hub</h1>
         <h2 style="padding-left: 30px; margin-top: 0; margin-bottom:0;">CRM</h2>
      </header>
      <div style="
      background-color: #f5f5f5;
      padding-bottom: 20px;
      padding-top: 80px;
      padding-left: 60px;
      font-size: 16px;
      line-height: 1.5;
     ">
        <img
          style="max-width: 20%; height: 20%; margin-bottom: 10px; display: block; padding-top:20px;"
          src="https://crm-test-z2p9.onrender.com/kilit.jpeg"
        />
        <h3 style="margin-bottom: 5px;">
          Şifrenizi değiştirmek mi istiyorsunuz?
        </h3>
        <p style="margin-bottom: 10px; padding-top: 10px; font-size: medium">
          Şifrenizi değiştirmek istiyorsanız butona tıklayınız.
        </p>
        <a
          style="
            display: inline-block;
            padding: 5px;
            padding-inline-start: 30px;
            padding-inline-end: 30px;
            border-radius: 8px;
            background-color: #0057D9;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          "
          href="https://crm-daltonlar.vercel.app/set-password/${mailToken}"
          >Şifremi Değiştir
        </a>
        <p style="margin-bottom: 20px; padding-top: 60px; font-size: medium">
          Eğer bu mailin yanlış geldiğini düşünüyorsanız Lütfen Dikkate Almayınız
        </p>
      </div>
      <footer style="font-size: 12px; padding: 5px">
        Daltonlar Saygılar ve Sevgiler ile iyi Günler diler. Geçmiş olsun
        soyuldunuz :)
      </footer>
      </body>
      </html>
     
      `,
    };
 
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.error("E-posta gönderme hatası:", err);
      } else {
        console.log("E-posta gönderildi:", info);
      }
    });
    res.status(200).json({ message: "E-posta başarıyla gönderildi." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports = { sendEmail, sendChangePasswordMail };