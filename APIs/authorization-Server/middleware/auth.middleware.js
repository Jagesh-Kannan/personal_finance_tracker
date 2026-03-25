import jwt from 'jsonwebtoken';
import { auth_error, handle_token_error } from '../errorHandler/authError.handler.js';
import { catchAsync } from '../utils/catchAsync.js';

export const authenticate = catchAsync(async (req, res, next) => {
    // Get token from cookies
    const token = req.cookies.accessToken;

    // Check if token exists
    if (!token) {
        throw auth_error({
            statusCode: 401,
            message: 'Not authenticated. Please login first'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user info to request
        req.user = {
            id: decoded.id
        };
        
        next();
    } catch (err) {
        // Handle token errors using centralized token error handler
        throw handle_token_error(err);
    }
});
