require("dotenv").config();
const nodemailer = require("nodemailer");
const sendMail = async (mailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      //dönüştürücü oluşturuyoruz
      host: "smtp.gmail.com", //host: smtp sunucusunun adresi
      port: 587, ///port: smtp sunucusunun portu
      secure: false,
      auth: {
        user: process.env.GMAIL_USER, //gönderenin email adresi
        pass: process.env.GMAIL_PASSWORD, ///gönderenin şifresi
      },
      tls: {
        minVersion: "TLSv1.3",
        ciphers: "TLS_AES_256_GCM_SHA384",
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("E-posta başarıyla gönderildi:", info.response);
    return { success: true, info: info.response };
  } catch (error) {
    console.error("E-posta gönderilirken bir hata oluştu:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendMail;
