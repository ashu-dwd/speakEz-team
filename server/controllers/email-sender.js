import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


async function emailSender(email, subject, text) {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER || 'dwivediji425@gmail.com',
            pass: process.env.EMAIL_PASS || 'xjbi iyfv luob pnqi'
        },
    });

    const info = await transporter.sendMail({
        from: `"SpeakEz👻" <dwivediji425@gmail.com>`,
        to: email,
        subject: subject,
        text: text
    });

    console.log("✅ Message sent: %s", info.messageId);
    return info.messageId;
}

export default emailSender;
