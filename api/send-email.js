const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  // السماح بـ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("Request received:", req.method);
    console.log("Request body:", req.body);

    // التحقق من البيانات الأساسية
    const { name, email, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "الرجاء ملء جميع الحقول المطلوبة",
      });
    }

    // التحقق من متغيرات البيئة
    console.log("Environment variables check:", {
      SMTP_HOST: !!process.env.SMTP_HOST,
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      SMTP_PORT: process.env.SMTP_PORT,
    });

    if (
      !process.env.SMTP_HOST ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      console.error("Missing environment variables");
      return res.status(500).json({ message: "خطأ في إعدادات الخادم" });
    }

    // إعداد النقل
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Transporter created successfully");

    // إعداد خيارات البريد
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `رسالة جديدة من ${name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2>رسالة جديدة من الموقع</h2>
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>الموضوع:</strong> ${subject || "بدون موضوع"}</p>
          <p><strong>الرسالة:</strong></p>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
      `,
    };

    console.log("Attempting to send email...");

    // إرسال البريد
    const result = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", result.messageId);

    return res.status(200).json({ message: "تم إرسال الرسالة بنجاح" });
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء إرسال الرسالة",
      error: error.message,
    });
  }
};
