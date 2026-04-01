import { auth_error, handle_token_error } from '../errorHandler/authError.handler.js';
import { catchAsync } from '../utils/catchAsync.js';
import { getCookie } from '../utils/cookieHandler.util.js';
import { verify_getTokenPayload } from '../helper/token.handler.js';

export const authenticate = catchAsync(async (req, res, next) => {
    // Get token from cookies
    const token = getCookie(req, 'accessToken');
    // Check if token exists
    if (!token) {
        throw auth_error({
            statusCode: 401,
            message: 'Not authenticated. Please login first'
        });
    }

    try {
        // Verify token
        const decoded = verify_getTokenPayload(token);
        
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
