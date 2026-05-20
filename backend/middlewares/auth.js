import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();  
import { User } from "../models/User"  

// auth middleware
export const auth = async (req, res, next) => {
    try{
        // extract token
        const token = req.cookies.token
                        || req.body.token 
                        || req.header("Authorisation").replace("Bearer", "");

        // if token is missing
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // verify token
        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode; 
        } catch(error){
            return res.status(401).json({
              success: false,
              message: "Token is invalid",
            });
        }
        next();
    } catch(error){
        return res.status(401).json({
          success: false,
          message: "Something went wrong, while verifying the token",
        });
    }
}

// isStudent

// isInstructor

// isAdmin
