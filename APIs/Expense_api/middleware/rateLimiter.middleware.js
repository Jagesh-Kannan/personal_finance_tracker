import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// General rate limiter for all requests (optional)
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Rate limiter for login endpoint (stricter)
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 failed login attempts per windowMs
    message: 'Too many login attempts, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count all requests
    keyGenerator: (req, res) => {
        // Use email if provided, otherwise use IP with proper IPv6 handling
        return req.body?.email || ipKeyGenerator(req, res);
    }
});

// Rate limiter for registration endpoint
export const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 500, // limit each IP to 5 registrations per hour
    message: 'Too many accounts created from this IP, please try again after an hour.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        // Use email if provided to prevent spam accounts, otherwise use IPv6-safe IP
        return req.body?.email || ipKeyGenerator(req, res);
    }
});

// Rate limiter for password reset endpoint
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 password reset requests per hour
    message: 'Too many password reset requests, please try again after an hour.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        // Use email to prevent spam, otherwise use IPv6-safe IP
        return req.body?.email || ipKeyGenerator(req, res);
    }
});

// Rate limiter for email verification resend
export const verificationEmailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 verification email requests per hour
    message: 'Too many verification email requests, please try again after an hour.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        // Use IPv6-safe IP address
        return ipKeyGenerator(req, res);
    }
});

// Rate limiter for refresh token endpoint
export const refreshTokenLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 refresh attempts per minute
    message: 'Too many token refresh attempts, please try again after a minute.',
    standardHeaders: true,
    legacyHeaders: false,
});
