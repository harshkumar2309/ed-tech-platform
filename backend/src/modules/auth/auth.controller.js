import {
    generateAndSaveOTPService,
    registerUserService,
    loginUserService,
    changeUserPasswordService,
} from "./auth.service.js";


// ──────────────────────────────────────────────
// send otp
// ──────────────────────────────────────────────
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = await generateAndSaveOTPService(email);

        // return response successfully
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};


// ──────────────────────────────────────────────
// signup
// ──────────────────────────────────────────────
export const signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        const newUser = await registerUserService({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          accountType,
          contactNumber,
          otp,
        });

        // return response
        return res.status(200).json({
            success: true,
            message: "User is registered Successfully",
            newUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "User cannot be registered. Please try again",
        });
    }
};


// ──────────────────────────────────────────────
// login
// ──────────────────────────────────────────────
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { token, user } = await loginUserService(email, password);

        // create cookie and send response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        };
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "Logged in successfully.",
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Login failure, please try again.",
        });
    }
};


// ──────────────────────────────────────────────
// change password
// ──────────────────────────────────────────────
export const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;

        await changeUserPasswordService(email, oldPassword, newPassword, confirmPassword);

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Unable to change password, please try again.",
        });
    }
};
