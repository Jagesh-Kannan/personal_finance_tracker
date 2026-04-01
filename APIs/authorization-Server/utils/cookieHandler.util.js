

export const setCookiee = (res, key, value) => {

    try{
        res.cookie(key, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 3600000, // 1 hour
            domain: process.env.DOMAIN,
            path: '/'
        });
    } catch (err) {
        throw err;
    }
}

export const clearCookie = (res, key) => {
    try {
        res.clearCookie(key, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    } catch (err) {
        throw err;
    }

    return true;
}

export const getCookie = (req, key) => {
    try {
        return req.cookies[key];
    } catch (err) {
        throw err;
    }
}