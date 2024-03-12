

const nodemailer = require("nodemailer");

// E-posta gönderme işlemini gerçekleştiren fonksiyon
const sendEmail = async (req, res) => {
  try {
    // E-posta gönderim ayarları
    const transporter = nodemailer.createTransport({
      service: "Gmail", // E-posta servisi (örneğin Gmail)
      auth: {
        user: req.body.senderEmail, // Gonderen e-posta adresi
        pass: req.body.senderPassword, // Gonderen e-posta şifresi
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
    res.status(500).json({ error: "E-posta gönderme hatası."+error });
  }
};

module.exports = { sendEmail };