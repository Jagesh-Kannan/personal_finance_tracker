import { catchAsync } from "../utils/catchAsync.js";
import users_modal from "../modal/users.modal.js";
import { auth_error } from "../errorHandler/authError.handler.js";
import { verify_getTokenPayload } from "../helper/token.handler.js";

export const verifyEmail_register = catchAsync(async (req, res, next) => {
    const { token } = req.params;

    // Validate token is provided
    if (!token) {
        throw auth_error({
            statusCode: 400,
            message: 'Verification token is required'
        });
    }

    // Verify JWT token and extract payload
    let decoded;
    try {
        decoded = verify_getTokenPayload(token);
    } catch (err) {
        throw auth_error({
            statusCode: 401,
            message: 'Invalid or expired verification token'
        });
    }

    const userId = decoded.id;

    if (!userId) {
        throw auth_error({
            statusCode: 400,
            message: 'Invalid token payload - no user ID found'
        });
    }

    // Find user by ID
    const user = await users_modal.findById(userId);
    
    if (!user) {
        throw auth_error({
            statusCode: 404,
            message: 'User not found'
        });
    }

    // Check if already verified
    if (user.emailVerified) {
        return res.status(200).json({
            status: 'success',
            message: 'Email already verified'
        });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Email verified successfully'
    });
});

