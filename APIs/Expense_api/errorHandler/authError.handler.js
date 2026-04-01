export const auth_error = (errBody) => {
    // Create an error object with status code and message
    const error = new Error(errBody.message);
    error.statusCode = errBody.statusCode || 401;
    error.status = "error";
    
    // Return the error object to be passed to next()
    return error;
};

export const handle_token_error = (err) => {
    // Handle token expiration
    if (err.name === 'TokenExpiredError') {
        return auth_error({
            statusCode: 401,
            message: 'Token expired. Please login again'
        });
    }
    
    // Handle invalid signature or malformed token
    if (err.name === 'JsonWebTokenError') {
        return auth_error({
            statusCode: 401,
            message: 'Invalid token. Please login again'
        });
    }
    
    // Handle any other JWT errors
    return auth_error({
        statusCode: 401,
        message: 'Token verification failed. Please login again'
    });
};