import { generateAccessToken, generateRefreshToken } from "./token.handler.js";
import { setCookiee } from "../utils/cookieHandler.util.js";
import bcrypt from "bcrypt";
import { auth_error } from "../errorHandler/authError.handler.js";

export const set_token_cookie = (res, user, accessToken, refreshToken) => {

    if(!accessToken || !refreshToken) {
        accessToken = generateAccessToken({ id: user._id });
        refreshToken = generateRefreshToken({ id: user._id });
    }

    // Set access token cookie
    setCookiee(res, 'accessToken', accessToken);

    // Set refresh token cookie
    setCookiee(res, 'refreshToken', refreshToken);

    return { accessToken, refreshToken };
}

export const verifyPassword = async (password, hashedPassword) => {

    const isMatch = await bcrypt.compare(password, hashedPassword);
    
    if(!isMatch) {
       throw auth_error({
            statusCode: 401,
            message: 'Incorrect password'
        });
    }
    
    return isMatch;
};
