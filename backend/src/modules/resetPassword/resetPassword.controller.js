import { User } from "../auth/auth.model.js";
import { generateResetTokenService, resetUserPasswordService } from "./resetPassword.service.js";

// ──────────────────────────────────────────────
// resetPassword token
// ──────────────────────────────────────────────

export const resetPasswordToken = async (req, res) => {
  try {
    // get email
    const email = req.body.email;

    // generate token service
    await generateResetTokenService(email);

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
        await resetUserPasswordService(password, confirmPassword, token);

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