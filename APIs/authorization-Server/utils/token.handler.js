import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) => {

    const secret = process.env.JWT_SECRET ;
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  
    return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (payload) => {

    const secret = process.env.JWT_SECRET ;
    const expiresIn = '7d'; // Refresh token valid for 7 days  

    return jwt.sign(payload, secret, { expiresIn });
};