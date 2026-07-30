

// resetPassword token 

import { User } from "../auth/auth.model.js";

export const resetPasswordToken = async (req, res) => {
    // get email 
    const email = req.body.email;

    // validate email
    const userExist = await User.findOne({email: email});
    if(!user){
        return res.status(404).json({
            success: false,
            message: 'Your Email is not registered with us.'
        });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");

    // update user by adding token & expiration time

}
