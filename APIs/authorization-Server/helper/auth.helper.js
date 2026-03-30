import { generateAccessToken, generateRefreshToken } from "./token.handler.js";
import { setCookiee } from "../utils/cookieHandler.util.js";

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