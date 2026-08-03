import { User } from "./auth.model.js";
import { Profile } from "../profile/profile.model.js";
import { OTP } from "./otp.model.js";
import { mailSender } from "../../utils/mailSender.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


// ──────────────────────────────────────────────
// Helper: throw an error that the controller can
// translate into an HTTP response
// ──────────────────────────────────────────────
const throwError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};


// ──────────────────────────────────────────────
// 1. Generate & save OTP
// ──────────────────────────────────────────────
export const generateAndSaveOTPService = async (email) => {

    // check if user already exist
    const checkUser = await User.findOne({ email });
    if (checkUser) {
        throwError(401, "User already registered");
    }

    // generate otp
    var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });

    console.log("OTP generated: ", otp);

    // check unique otp or not
    let result = await OTP.findOne({ otp: otp });

    while (result) {
        otp = otpGenerator(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        result = await OTP.findOne({ otp: otp });
    }

    // store generated otp in DB
    const otpPayload = { email, otp };

    // create an entry in DB for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    return otp;
};


// ──────────────────────────────────────────────
// 2. Register a new user / SIGN UP
// ──────────────────────────────────────────────
export const registerUserService = async ({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    contactNumber,
    otp,
}) => {

    // validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber) {
        throwError(403, "All fields are required");
    }

    // passwords must match
    if (password !== confirmPassword) {
        throwError(400, "Password and Confirm Password value does not match, please try again.");
    }

    // check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
        throwError(400, "User is already registered.");
    }

    // find the most recent OTP stored in DB for the user
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(recentOtp);

    if (recentOtp.length === 0) {
        throwError(400, "OTP not found");
    } else if (otp !== recentOtp) {
        throwError(400, "Invalid OTP");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create profile entry in DB
    const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
    });

    // create user entry in DB
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        contactNumber,
        accountType,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return newUser;
};


// ──────────────────────────────────────────────
// 3. Log in a user
// ──────────────────────────────────────────────
export const loginUserService = async (email, password) => {

    // validate data
    if (!email || !password) {
        throwError(403, "All fields are required, please fill all the details.");
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        throwError(401, "User is not registered, please signup first.");
    }

    // generate JWT token after password matching
    if (await bcrypt.compare(password, user.password)) {
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });
        user.token = token;
        user.password = undefined;

        return { token, user };
    } else {
        throwError(401, "Invalid password.");
    }
};


// ──────────────────────────────────────────────
// 4. Change password
// ──────────────────────────────────────────────
export const changeUserPasswordService = async (email, oldPassword, newPassword, confirmPassword) => {

    // validate data
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
        throwError(400, "All fields are required, please fill all the details.");
    }

    // check if user exist
    const user = await User.findOne({ email });
    if (!user) {
        throwError(404, "User not found.");
    }

    // verify newPassword and confirmPassword matches
    if (newPassword !== confirmPassword) {
        throwError(401, "New Password and Confirm Password do not match, please re-enter them correctly.");
    }

    // verify old password
    if (await bcrypt.compare(oldPassword, user.password)) {
        // hash new password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // update password in DB
        user.password = newHashedPassword;
        await user.save();

        // send confirmation mail
        await mailSender(
            user.email,
            "Password Updated Successfully",
            `<h2>Password Updated</h2>
            <p>Your password has been changed successfully.</p>
            <p>If this wasn't you, please contact support immediately.</p>`,
        ).catch(err => console.log("Mail error:", err));

        return;
    } else {
        throwError(401, "Old Password entered is incorrect, please re-enter old password.");
    }
};
