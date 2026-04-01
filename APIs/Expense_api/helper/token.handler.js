import jwt from 'jsonwebtoken';
import { auth_error } from '../errorHandler/authError.handler.js';

// export const generateAccessToken = (payload) => {

//     const secret = process.env.JWT_SECRET ;
//     const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

//     return jwt.sign(payload, secret, { expiresIn });
// };

// export const generateRefreshToken = (payload) => {

//     const secret = process.env.JWT_SECRET ;
//     const expiresIn = '7d'; // Refresh token valid for 7 days  

//     return jwt.sign(payload, secret, { expiresIn });
// };

export const generateJWTVerificationToken = (payload) => {

    const secret = process.env.JWT_SECRET ;
    const expiresIn = '1d'; // Email verification token valid for 1 day

    return jwt.sign(payload, secret, { expiresIn });
};

export const verify_getTokenPayload = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
       throw auth_error({
            statusCode: 401,
            message: 'Invalid or expired verification token'
        });
    }
};