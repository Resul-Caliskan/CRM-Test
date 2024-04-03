const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
 
const sendEmail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "resulcaliskansau@gmail.com", // buraya venhancer e-posta adresi gelecek
        pass: "boou obke qieo vnqe", // buraya venhancer  e-posta adresi için şifre oluşturulmalı
      },
    });
 
    const mailOptions = {
      from:"resulcaliskansau@gmail.com",
      to: req.body.recipientEmail,
      subject: "Venhancer CRM",
      html:`<!DOCTYPE html>
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
        margin: 0;
        padding: 0;
        text-align: center;
      }
     
      header {
        background-color: #000000;
        color: white;
        text-align: center;
        position: relative;
      }
     
      header h1,
      header h2 {
        padding-left: 30px;
        margin-top: 0;
        margin-bottom: 0;
      }
     
      #main-content {
        background-color: #f5f5f5;
        font-size: 16px;
        line-height: 1.5;
        justify-content: center;
        padding-top: 30px;
      }
     
      #main-content img {
        max-width: 20%;
        height: 20%;
      }
     
      #main-content h3 {
        margin-bottom: 5px;
      }
     
      #main-content p {
        margin-bottom: 10px;
        padding-top: 10px;
        font-size: medium;
      }
     
      #main-content a {
        display: inline-block;
        padding: 5px;
        padding-inline-start: 30px;
        padding-inline-end: 30px;
        border-radius: 8px;
        background-color: #0057d9;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
     
      #main-content footer {
        font-size: 12px;
        padding: 5px;
      }
     
      @media only screen and (min-width: 600px) {
        body {
          width: 70%;
          padding: 20px;
          text-align: left;
        }
     
        header  {
         
          padding: 20px;
          text-align: left;
       
        }
     
        #main-content {
          padding-left: 60px;
          padding-bottom: 20px;
          padding-top: 80px;
        }
     
        #main-content img {
          margin-bottom: 10px;
          display: block;
          padding-top: 20px;
        }
     
        #main-content p:last-child {
          padding-top: 60px;
          margin-bottom: 20px;
        }
     
        footer{
          margin-top: 25px;
          font-size: small;
        }
      }
     
      @media only screen and (max-width: 599px) {
        header h1,
        header h2 {
          padding-left: 0;
        }
     
        #main-content {
          padding-left: 10px;
          padding-right: 10px;
        }
      }
      </style>
      </head>
      <body>
      <header>
        <h1>HR Hub</h1>
        <h2>CRM</h2>
      </header>
     
      <div id="main-content">
       
        <h3>HRHUB CRM'e Hoşgeldiniz</h3>
        <p>HRHUB'ı Keşfetmek İçin Aşağıdaki Butona Tıklayınız</p>
        <a href="https://crm-daltonlar.vercel.app">
          HRHUB'ı Keşfet
        </a>
        <p>
          Eğer bu mailin yanlış geldiğini düşünüyorsanız Lütfen Dikkate
          Almayınız
        </p>
      </div>
     
      <footer>
        Daltonlar Saygılar ve Sevgiler ile iyi Günler diler. Geçmiş olsun
        soyuldunuz :)
      </footer>
      </body>
      </html>
     
      `
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
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  text-align: center;
}
 
header {
  background-color: #000000;
  color: white;
  text-align: center;
  position: relative;
}
 
header h1,
header h2 {
  padding-left: 30px;
  margin-top: 0;
  margin-bottom: 0;
}
 
#main-content {
  background-color: #f5f5f5;
  font-size: 16px;
  line-height: 1.5;
  justify-content: center;
  padding-top: 30px;
}
 
#main-content img {
  max-width: 20%;
  height: 20%;
}
 
#main-content h3 {
  margin-bottom: 5px;
}
 
#main-content p {
  margin-bottom: 10px;
  padding-top: 10px;
  font-size: medium;
}
 
#main-content a {
  display: inline-block;
  padding: 5px;
  padding-inline-start: 30px;
  padding-inline-end: 30px;
  border-radius: 8px;
  background-color: #0057d9;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
 
#main-content footer {
  font-size: 12px;
  padding: 5px;
}
 
@media only screen and (min-width: 600px) {
  body {
    width: 70%;
    padding: 20px;
    text-align: left;
  }
 
  header  {
   
    padding: 20px;
    text-align: left;
 
  }
 
  #main-content {
    padding-left: 60px;
    padding-bottom: 20px;
    padding-top: 80px;
  }
 
  #main-content img {
    margin-bottom: 10px;
    display: block;
    padding-top: 20px;
  }
 
  #main-content p:last-child {
    padding-top: 60px;
    margin-bottom: 20px;
  }
 
  footer{
    margin-top: 25px;
    font-size: small;
  }
}
 
@media only screen and (max-width: 599px) {
  header h1,
  header h2 {
    padding-left: 0;
  }
 
  #main-content {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
</head>
<body>
<header>
  <h1>HR Hub</h1>
  <h2>CRM</h2>
</header>
 
<div id="main-content">
  <img src="https://crm-test-z2p9.onrender.com/kilit.jpeg" />
  <h3>Şifrenizi değiştirmek mi istiyorsunuz?</h3>
  <p>Şifrenizi değiştirmek istiyorsanız butona tıklayınız.</p>
  <a href="https://crm-daltonlar.vercel.app/set-password/${mailToken}">
    Şifremi Değiştir
  </a>
  <p>
    Eğer bu mailin yanlış geldiğini düşünüyorsanız Lütfen Dikkate
    Almayınız
  </p>
</div>
 
<footer>
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
