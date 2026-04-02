import express from 'express';
import { create_user, getCurrent_user, get_user, resetPasssword } from '../controller/users.controller.js';
import { forgotPassword, login, refreshTokenHandler, logout } from '../controller/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { loginLimiter, registrationLimiter, passwordResetLimiter, refreshTokenLimiter } from '../middleware/rateLimiter.middleware.js';

const users_router = express.Router();


// POST: Create a new user with encrypted password
users_router.post('/signup', registrationLimiter, create_user);

// POST: Login user
users_router.post('/login', loginLimiter, login);

// POST: Refresh access token using refresh token
users_router.post('/refresh-token', refreshTokenLimiter, refreshTokenHandler);

// GET: Current user (protected route)
users_router.get('/me', authenticate, getCurrent_user);

// POST: Forgot password
users_router.post('/forgot-password', passwordResetLimiter, forgotPassword);

// POST: Reset password
users_router.post('/reset-password/:token', passwordResetLimiter, resetPasssword);

// POST: Logout
users_router.get('/logout', logout);


export default users_router;