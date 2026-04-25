import { catchAsync } from "../utils/catchAsync.js";
import users_modal from "../modal/users.modal.js";
import { auth_error } from "../errorHandler/authError.handler.js";
import { verify_getTokenPayload } from "../helper/token.handler.js";
import { emailVerificationResponse_template as HTML_TEMPLATE } from "../utils/email.template.js";

export const verifyEmail_register = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const login_url = process.env.CLIENT_URL + '/login';

    let message = '';
    let type = 'error';

    // Validate token is provided
    if (!token) {
        // throw auth_error({
        //     statusCode: 400,
        //     message: 'Verification token is required'
        // });
        message = 'Verification token is required';
        type = 'error';
        return res.status(200).send(HTML_TEMPLATE(login_url, message, type));
    }

    // Verify JWT token and extract payload
    let decoded;
    try {
        decoded = verify_getTokenPayload(token);
    } catch (err) {
        // throw auth_error({
        //     statusCode: 401,
        //     message: 'Invalid or expired verification token'
        // });
         message = 'Invalid or expired verification token';
        type = 'error';
        return res.status(200).send(HTML_TEMPLATE(login_url, message, type));
    }

    const userId = decoded.id;

    if (!userId) {
        // throw auth_error({
        //     statusCode: 400,
        //     message: 'Invalid token payload - no user ID found'
        // });
        message = 'Invalid token payload - no user ID found';
        type = 'error';
        return res.status(200).send(HTML_TEMPLATE(login_url, message, type));
    }

    // Find user by ID
    const user = await users_modal.findById(userId);
    
    if (!user) {
        // throw auth_error({
        //     statusCode: 404,
        //     message: 'User not found'
        // });
        message = 'User not found';
        type = 'error';
        return res.status(200).send(HTML_TEMPLATE(login_url, message, type));
    }

    // Check if already verified
    if (user.emailVerified) {
        message = 'Email already verified';
        type = 'success';
        return res.status(200).send(HTML_TEMPLATE(login_url, message, type));
    }

    // Mark email as verified
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    message = 'Email verified successfully';
    type = 'success';
    return res.status(200).send(HTML_TEMPLATE(login_url, message, type));
});

