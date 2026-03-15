import nodemailer from "nodemailer";
import { verifyAccountTemplate, passwordResetTemplate } from "./emailTemplate.js"
import jwt from "jsonwebtoken";
export const sendEmail = async (email, url, reset=false) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
    if(!reset){
        const emailToken = jwt.sign(email, process.env.JWT_SECRET);
        url = `${url}/${emailToken}`;
    }

    await transporter.sendMail({
        from: `From <${process.env.GMAIL}>`,
        to: email,
        subject: "Verify Your Email",
        html: reset ? passwordResetTemplate(url) : verifyAccountTemplate(url),
    });
}