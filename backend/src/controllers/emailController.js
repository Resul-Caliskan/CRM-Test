const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const fs = require("fs");
const path = require("path");


function imageToBase64(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  return Buffer.from(imageData).toString('base64');
}

const imagePath = path.join(__dirname, '..', '..', 'public', 'kilit.jpeg');
const base64Image = imageToBase64(imagePath);


// E-posta gönderme işlemini gerçekleştiren fonksiyon
const sendEmail = async (req, res) => {
  try {
    // E-posta gönderim ayarları
    const transporter = nodemailer.createTransport({
      service: "Gmail", // E-posta servisi (örneğin Gmail)
      auth: {
        user: "resulcaliskansau@gmail.com", // buraya venhancer e-posta adresi gelecek
        pass: "boou obke qieo vnqe", // buraya venhancer  e-posta adresi için şifre oluşturulmalı
      },
    });

    // E-posta içeriği
    const mailOptions = {
      from: req.body.senderEmail,
      to: req.body.recipientEmail, // Alıcı e-posta adresi
      subject: "Venhancer CRM",
      text: "Kullanıcı Talebiniz Onaylanmıştır",
    };

    // E-postayı gönder
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
      service: "Gmail", // E-posta servisi (örneğin Gmail)
      auth: {
        user: "resulcaliskansau@gmail.com", // buraya venhancer e-posta adresi gelecek
        pass: "boou obke qieo vnqe", // buraya venhancer  e-posta adresi için şifre oluşturulmalı
      },
    });

    const id = req.body.id;
    const mailToken = jwt.sign({ id }, config.secretKey, {
      expiresIn: "1d",
    });
    // Gönderilecek e-posta içeriği
    const mailOptions = {
      from: req.body.senderEmail,
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
          body {
            font-family: Arial, sans-serif;
          }
          header {
            padding: 20px;
            background-color: #0057d9;
            color: white;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <header>
          <h1 style="padding-left: 30px">HR Hub </h1>
          <h3 style="padding-left: 30px">CRM </h3>
        </header>
        <main
          style="
            background-color: #f5f5f5;
            padding: 20px;
            padding-top: 80px;
            padding-left: 60px;
            font-size: 16px;
            line-height: 1.5;
          "
        >
          <img
            style="max-width: 20%; height: 20%; margin-bottom: 10px; display: block"
            src="data:image/jpeg;base64,${base64Image}"
          />
          <h3 style="margin-bottom: 5px; position: relative">
            Sayın kullanıcı şifrenizi değiştirmek mi istiyorsunuz?
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
              background-color: black;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            "
            href="https://localhost:3000/sifre-degistirme/${mailToken}"
            >Şifremi Değiştir
          </a>
          <p style="margin-bottom: 20px; padding-top: 60px; font-size: medium">
            Eğer bu mailin yanlış geldiğini düşünüyorsanız Lütfen Dikkate Almayınız
          </p>
        </main>
        <footer style="font-size: 12px; padding: 5px">
          Daltonlar Saygılar ve Sevgiler ile iyi Günler diler. Geçmiş olsun
          soyuldunuz :)
        </footer>
      </body>
    </html>
      `,
    };

    // E-postayı gönderme
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
