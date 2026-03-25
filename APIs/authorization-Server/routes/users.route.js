import express from 'express';
import { create_user, getCurrent_user, get_user } from '../controller/users.controller.js';
import { login, refreshTokenHandler } from '../controller/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const users_router = express.Router();


// POST: Create a new user with encrypted password
users_router.post('/signup', create_user);

// POST: Login user
users_router.post('/login', login);

// POST: Refresh access token using refresh token
users_router.post('/refresh-token', refreshTokenHandler);

// GET: Current user (protected route)
users_router.get('/me', authenticate, getCurrent_user);


export default users_router;