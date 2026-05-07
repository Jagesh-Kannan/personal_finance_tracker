import nodemailer from 'nodemailer';
import { decrypt } from './crypto.util.js';

export const sendEmail = async (to, subject, text, html = null) => {

        try {

            const decryptedEmailPass = decrypt(process.env.EMAIL_PASS);
            // Create a transporter using your email service credentials
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                service: process.env.EMAIL_SERVICE,
                secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: decryptedEmailPass
                }
            });
    
            // Define the email content
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: to,
                subject: subject,
                text: text,
                ...(html && { html: html })  // Include HTML if provided
            };
    
            // Send the email
            const info = await transporter.sendMail(mailOptions);
    
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            
            return info;
    
        } catch (error) {
            throw error;
        }

    };