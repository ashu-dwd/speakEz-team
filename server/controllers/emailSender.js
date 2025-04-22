import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


async function emailSender(email, subject, text) {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email", // Use gmail's SMTP if using Gmail
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // 👈 Secure via env
            pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: `"Raghav Dwivedi 👻" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        text: text
    });

    console.log("✅ Message sent: %s", info.messageId);
    return info.messageId;
}

export default emailSender;
