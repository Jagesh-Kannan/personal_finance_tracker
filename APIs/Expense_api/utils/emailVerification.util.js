import { generateJWTVerificationToken } from "../helper/token.handler.js";
import { auth_error } from "../errorHandler/authError.handler.js";
import { sendEmail } from './sendEmail.util.js';
import { verifyEmail_template, resetPassword_template } from "./email.template.js";


export const sendVerificationEmail = async (userEmail, verificationToken) => {

    const verificationLink = `${process.env.SERVER_URL}/verify-email/${verificationToken}`;
    const subject = 'Email Verification';
    
    const text = `Please click on the following link to verify your email: ${verificationLink}`;
    const html = verifyEmail_template(verificationLink);

    try {
        await sendEmail(userEmail, subject, text, html);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw auth_error({
            statusCode: 500,
            message: 'Failed to send verification email. Please try again later.'
        });
    }
};

export const sendPasswordResetEmail = async (userEmail, verificationToken)=> {
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${verificationToken}`;
    const subject = 'Password Reset Request';
    
    const text = `Please click on the following link to reset your password: ${resetLink}`;
    
    const html =  resetPassword_template(resetLink);

    try {
        await sendEmail(userEmail, subject, text, html);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error; // Let caller handle this error
    }
};

export const verifyEmail_login = async (user) => {
    if (!user.emailVerified) {

        const verificationToken = generateEmailVerificationToken(user);
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        await sendVerificationEmail(user.email, verificationToken);

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