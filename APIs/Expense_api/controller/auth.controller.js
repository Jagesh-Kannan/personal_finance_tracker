import { catchAsync } from "../utils/catchAsync.js";
import { verify_getTokenPayload } from "../helper/token.handler.js";
import { auth_error } from "../errorHandler/authError.handler.js";
import { get_user } from "./users.controller.js";
import { sendPasswordResetEmail, generateEmailVerificationToken, verifyEmail_login } from "../utils/emailVerification.util.js";
import { set_token_cookie, verifyPassword } from "../helper/auth.helper.js";
import { clearCookie, getCookie } from "../utils/cookieHandler.util.js";

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
        message: 'Login successful',
        data: {
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    });
});

export const refreshTokenHandler = catchAsync(async (req, res, next) => {
    // Get refresh token from cookies

    const refresh_token = getCookie(req, 'refreshToken') || req.body.refreshToken;

    // Check if refresh token exists
    if (!refresh_token) {
        throw auth_error({
            statusCode: 401,
            message: 'Refresh token not found. Please login again'
        });
    }

    try {
        // Verify refresh token 
        const decoded =  verify_getTokenPayload(refresh_token);

        // Find user by ID to ensure user still exists
        const user = await get_user({ id: decoded.id });

        // Generate new access token
        // Set new tokens in cookies
        const{accessToken, refreshToken} = set_token_cookie(res, user, undefined, undefined);

        // Return success response
        res.status(200).json({
            status: 'success',
            message: 'Token generated successfully',
            data: {
            user: {
                id: user._id,
                email: user.email
            },
            accessToken: accessToken,
            refreshToken: refreshToken
        }
        });

    } catch (err) {
        // If refresh token is invalid or expired  
        throw auth_error({
            statusCode: 401,
            message: 'Invalid or expired refresh token. Please login again'
        });
    }
});

 export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw auth_error({
            statusCode: 400,
            message: 'Please provide email'
        });
    }

    const user = await get_user({ email });

    if(user.emailVerified == false) {
        throw auth_error({
            statusCode: 403,
            message: 'Email not verified. Please verify your email before resetting password.'
        });
    }

    // Generate password reset token
    const resetToken = generateEmailVerificationToken(user);

    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    try {
        await sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
        // If email fails, clear the reset token
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });
        
        throw auth_error({
            statusCode: 500,
            message: 'Failed to send password reset email. Please try again later.'
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Password reset instructions sent to email'
    });
});

export const logout = catchAsync(async (req, res, next) => {
    // Clear the access token and refresh token cookies

    clearCookie(res, 'accessToken');
    clearCookie(res, 'refreshToken');

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
});
