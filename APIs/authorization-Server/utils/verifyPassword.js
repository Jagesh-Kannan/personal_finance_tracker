import bcrypt from "bcrypt";
import { auth_error } from "../errorHandler/authError.handler.js";

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