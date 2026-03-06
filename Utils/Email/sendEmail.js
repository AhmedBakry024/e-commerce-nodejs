import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js"
import jwt from "jsonwebtoken";
export const sendEmail = async (email, url) => {
    console.log(email);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
    
    const emailToken = jwt.sign(email, process.env.JWT_SECRET);
    url = `${url}/${emailToken}`
    const info = await transporter.sendMail({
        from: `From <${process.env.GMAIL}>`,
        to: email,
        subject: "Verify Your Email",
        html: emailTemplate(url),
    });

    console.log("Message sent:", info.messageId);
}