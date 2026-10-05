import nodemailer from 'nodemailer';
import { decrypt } from './crypto.util.js';
import { BrevoClient } from '@getbrevo/brevo';


const brevo = new BrevoClient({
  apiKey: process.env.BREVOAPIKEY 
});


// export const sendEmail = async (to, subject, text, html = null) => {

//         try {

//             const decryptedEmailPass = decrypt(process.env.EMAIL_PASS);
//             // Create a transporter using your email service credentials
//             // const transporter = nodemailer.createTransport({
//             //     host: process.env.EMAIL_HOST,
//             //     port: process.env.EMAIL_PORT,
//             //     service: process.env.EMAIL_SERVICE,
//             //     secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
//             //     auth: {
//             //         user: process.env.EMAIL_USER,
//             //         pass: decryptedEmailPass
//             //     }
//             // });
    

// let transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false, // true for 465, false for 587
//   auth: {
//     user: "personalfinancetrackerservice@gmail.com", // Your Brevo account email
//     // Your master SMTP key generated in SMTP & API settings
//   },
// });

//             // Define the email content
//             // const mailOptions = {
//             //     from: process.env.EMAIL_USER,
//             //     to: to,
//             //     subject: subject,
//             //     text: text,
//             //     ...(html && { html: html })  // Include HTML if provided
//             // };
    
// let mailOptions = {
//   from: '"Personal Finance Tracker" personalfinancetrackerservice@gmail.com',
//   to: to,
//   subject: subject,
//   text: text,
//   ...(html && { html: html })
// };
//             // Send the email
//             const info = await transporter.sendMail(mailOptions);
    
//             console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            
//             return info;
    
//         } catch (error) {
//             throw error;
//         }

//     };




export const sendEmail = async (to, subject, text, html = null) => {

        try {

            // const decryptedEmailPass = decrypt(process.env.EMAIL_PASS);
            // Create a transporter using your email service credentials
            // const transporter = nodemailer.createTransport({
            //     host: process.env.EMAIL_HOST,
            //     port: process.env.EMAIL_PORT,
            //     service: process.env.EMAIL_SERVICE,
            //     secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
            //     auth: {
            //         user: process.env.EMAIL_USER,
            //         pass: decryptedEmailPass
            //     }
            // });
    

            // Define the email content
            // const mailOptions = {
            //     from: process.env.EMAIL_USER,
            //     to: to,
            //     subject: subject,
            //     text: text,
            //     ...(html && { html: html })  // Include HTML if provided
            // };


            const result = await brevo.transactionalEmails.sendTransacEmail({
            // The "sender" can be the individual mailbox you authenticated in Brevo
            sender: { 
                name: 'Finance Tracker Service', 
                email: 'personalfinancetrackerservice@gmail.com' 
            },
            // Pass the destination email directly. 
            // It will NOT save this recipient to your Brevo Contacts dashboard.
            to: [
                { 
                email: to
                }
            ],
            subject: 'Hello from Node.js!',
            htmlContent: '<html><body><h1>Success!</h1><p>Sent via Node.js without saving contacts.</p></body></html>'
            });
    
            // Send the email
            // const info = await transporter.sendMail(mailOptions);
    
            console.log("Preview URL: %s", result);
            
            return result;
    
        } catch (error) {
            throw error;
        }

    };