import { User } from "../auth/auth.model.js";
import { generateResetToken } from "./resetPassword.service.js";

// ──────────────────────────────────────────────
// resetPassword token
// ──────────────────────────────────────────────

export const resetPasswordToken = async (req, res) => {
  try {
    // get email
    const email = req.body.email;

    // generate token service
    await generateResetToken(email);

    // return response

    return res.json({
      success: true,
      message: "Token is generated successfully",
    });
  } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        });
    }
};


// ──────────────────────────────────────────────
// Reset Password
// ──────────────────────────────────────────────

export const resetPassword = async (req, res) => {
    try {
        // fetch data
        const { password, confirmPassword, token } = req.body;

        // resetUserPassword service
        await resetUserPassword(password, confirmPassword, token);

        // return response
        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully!",
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

// Reset Password

export const resetPassword = (req, res) => {
    try{
        // fetch data
        const { password, confirmPassword, token } = req.body;

        // validate data
        if(password !== confirmPassword){
            return res.json({
                success: true,
                message: 'Password & Confirm Password does not match',
            })
        }

        // get user Details from DB using token
        const userDetails = await User.findOne({token: token});

        // If no entry
        if(!userDetails){
            return res.json({
                success: false,
                message: 'Token is invalid',
            });
        }

        // check token expiry
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: 'Token is expired. Please regenerate your token',
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10); 

        // update password
        await User.findOneAndUpdate(
            { token : token },
            { password: hashedPassword },
            { new: true },
        )

        // return response
        return res.status(200).json({
            success: true,
            message: 'Password has been reset successfully!',
        });
    } catch(err){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}