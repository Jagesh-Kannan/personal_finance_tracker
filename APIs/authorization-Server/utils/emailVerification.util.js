import nodemailer from 'nodemailer';
import {config} from 'dotenv';
import crypto from 'crypto';
import { generateJWTVerificationToken } from "../helper/token.handler.js";

import { auth_error } from "../errorHandler/authError.handler.js";
config();

export const sendVerificationEmail = async (userEmail, userId, verificationToken) => {
    try {
        // Create a transporter using your email service credentials
        // const transporter = nodemailer.createTransport({
        //     host: process.env.EMAIL_HOST,
        //     port: process.env.EMAIL_PORT,
        //     service: process.env.EMAIL_SERVICE,
        //     secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     }
        // });


        // tester
         // Create a test account
  let testAccount = await nodemailer.createTestAccount();

  // Create a transporter using the test SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });


        // Define the email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Email Verification',
            text: `Please click on the following link to verify your email: ${process.env.CLIENT_URL}/verify-email/${verificationToken}`
        };

        // Send the email
        const info =await transporter.sendMail(mailOptions);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (error) {
        throw error;
    }
};

export const verifyEmail_login = async (user) => {
    if (!user.emailVerified) {

        const verificationToken = generateEmailVerificationToken(user);
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        await sendVerificationEmail(user.email, user.id, verificationToken);

        throw auth_error({
            statusCode: 403,
            message: 'Email not verified. A new verification email has been sent.'
        });
    }
} 

export const generateEmailVerificationToken = (user) => {
    // Generate a jwt token
    return generateJWTVerificationToken({ id: user._id });
};