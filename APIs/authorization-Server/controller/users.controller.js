import { auth_error } from "../errorHandler/authError.handler.js";
import users_modal from "../modal/users.modal.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendVerificationEmail, generateEmailVerificationToken } from "../utils/emailVerification.util.js";

export const create_user = catchAsync(async (req, res, next) => {

    const { firstName, lastName, email, password, passwordConfirm } = req.body;


    const user = await users_modal.create({
        firstName,
        lastName,
        email,
        password,
        passwordConfirm
    });

    await user.save({ validateBeforeSave: false });


    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.passwordConfirm;
    delete userResponse.verificationToken;
    delete userResponse.verificationTokenExpires;


    const verificationToken = generateEmailVerificationToken(user);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours

    // Save user with verification token
     await user.save({ validateBeforeSave: false });

    // Send verification email
    await sendVerificationEmail(user.email, user.id, verificationToken);
    

    res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: userResponse
    });
});

// Internal utility function to get user by email or ID
// Returns user object or throws auth_error if not found
// Used internally by auth.controller
export const get_user = async (param) => {
    try {
        // Validate parameter
        if (!param) {
            throw auth_error({
                statusCode: 400,
                message: 'Please provide email or user ID'
            });
        }

        let user;

        // Search by email
        if (param.email) {
            user = await users_modal.findOne({ email: param.email }).select('+password');
            if (!user) {
                throw auth_error({
                    statusCode: 404,
                    message: 'User not found'
                });
            }
            return user;
        }

        // Search by user ID
        if (param.id) {
            user = await users_modal.findById(param.id).select('-password');
            if (!user) {
                throw auth_error({
                    statusCode: 404,
                    message: 'User not found'
                });
            }
            return user;
        }

        // If neither email nor id provided
        throw auth_error({
            statusCode: 400,
            message: 'Please provide email or user ID'
        });

    } catch (error) {
        throw error;
    }
};

export const getCurrent_user = catchAsync(async (req, res, next) => {
    // req.user is set by protect middleware
    const user = await users_modal.findById(req.user.id).select('-password');

    if (!user) {
        throw auth_error({
            statusCode: 404,
            message: 'User not found'
        });
    }

    res.status(200).json({
        status: 'success',
        user: user
    });
});

export const resetPasssword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw auth_error({
            statusCode: 400,
            message: 'Please provide email'
        });
    }

    const user = await users_modal.findOne({ email });
    if (!user) {
        throw auth_error({
            statusCode: 404,
            message: 'User not found'
        });
    }

    // Here you would typically generate a password reset token and send an email
    // For simplicity, we will just return a success message
    res.status(200).json({
        status: 'success',
        message: 'Password reset instructions sent to email (not really, this is a placeholder)'
    });

  });