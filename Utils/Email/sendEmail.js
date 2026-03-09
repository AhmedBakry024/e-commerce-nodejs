import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js"
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
        url = `${url}/${emailToken}`
    }

    const info = await transporter.sendMail({
        from: `From <${process.env.GMAIL}>`,
        to: email,
        subject: "Verify Your Email",
        html: emailTemplate(url),
    });

    console.log("Message sent:", info.messageId);
}
// export class Email {
//     constructor(email, url) {
//         this.to = email;
//         this.url = url;
//         this.from = process.env.GMAIL;
//     }

//     newTransport() {
//         return nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.GMAIL,
//                 pass: process.env.GMAIL_PASSWORD,
//             },
//         });
//     }

//     // Send the actual email
//     async send(template, subject) {
//         // 1) Render HTML based on a pug template
//         let html;
//         if(template === "passwordReset") html = emailTemplate(this.url);
//         else html = emailTemplate(this.url);

//         // 2) Define email options
//         const mailOptions = {
//             from: this.from,
//             to: this.to,
//             subject,
//             html,
//         };

//         // 3) Create a transport and send email
//         await this.newTransport().sendMail(mailOptions);
//     }

//     async sendWelcome() {
//         await this.send('welcome', 'Welcome to the Natours Family!');
//     }

//     async sendPasswordReset() {
//         await this.send(
//             'passwordReset',
//             'Your password reset token (valid for only 10 minutes)'
//         );
//     }
// };