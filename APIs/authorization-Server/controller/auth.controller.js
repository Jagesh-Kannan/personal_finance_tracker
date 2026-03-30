import { catchAsync } from "../utils/catchAsync.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from "../helper/token.handler.js";
import { auth_error } from "../errorHandler/authError.handler.js";
import { get_user } from "./users.controller.js";
import { sendVerificationEmail, generateEmailVerificationToken, verifyEmail_login } from "../utils/emailVerification.util.js";
import { verifyPassword } from "../utils/verifyPassword.js";
import { set_token_cookie } from "../helper/auth.helper.js";

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        throw auth_error({
            statusCode: 400,
            message: 'Please provide email and password'
        });
    }

    // Find user by email and explicitly select password field
    const user = await get_user({ email });

    // verify email before allowing login
    await verifyEmail_login(user);

    // Password received from client is raw password
    // Compare with stored hashed password using bcrypt.compare()
    const verifcationResult = await verifyPassword(password, user.password);


    //generate and set tokens in cookies
    const { accessToken, refreshToken } = set_token_cookie(res, user, undefined, undefined);
    
    // Success response - tokens are in cookies, not in body
    res.status(200).json({
        status: 'success',
        message: 'Login successful'
    });
});

export const refreshTokenHandler = catchAsync(async (req, res, next) => {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;

    // Check if refresh token exists
    if (!refreshToken) {
        throw auth_error({
            statusCode: 401,
            message: 'Refresh token not found. Please login again'
        });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Find user by ID to ensure user still exists
        const user = await get_user({ id: decoded.id });

        if (!user) {
            throw auth_error({
                statusCode: 404,
                message: 'User not found'
            });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken({ id: user._id });

        // Optional: Generate new refresh token (token rotation for better security)
        const newRefreshToken = generateRefreshToken({ id: user._id });

        // Set new tokens in cookies
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 604800000 // 7 days
        });

        // Return success response
        res.status(200).json({
            status: 'success',
            message: 'Token generated successfully'
        });

    } catch (err) {
        // If refresh token is invalid or expired
        throw auth_error({
            statusCode: 401,
            message: 'Invalid or expired refresh token. Please login again'
        });
    }
});
