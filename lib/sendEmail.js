import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Define the email options
    const mailOptions = {
        from: 'Auth App <noreply@auth.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
    };

    //  Actually send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;