// ResetPassword service — business logic for resetPassword module

import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from "../auth/auth.model.js";
import { mailSender } from "../../utils/mailSender.js";
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
// 1. Generate reset-password token, save to DB,
//    and email the reset link to the user
// ──────────────────────────────────────────────
export const generateResetTokenService = async (email) => {
    
  // validate email
  const user = await User.findOne({ email: email });
  if (!user) {
    throwError(404, "Your Email is not registered with us.");
  }

  // generate token
  const token = crypto.randomBytes(32).toString("hex");
  
  // update user by adding token & expiration time
  const updatedDetails = await User.findOneAndUpdate(
    { email: email },
    {
      token: token,
      resetPasswordExpires: Date.now() + 5 * 60 * 1000,
    },
    { new: true },
  );

  // create url
  const url = `http://localhost:3000/update-password/${token}`;

  // send email containing the link
  await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);
  return updatedDetails;
};


// ──────────────────────────────────────────────
// 2. Reset the password using the token
// ──────────────────────────────────────────────

export const resetUserPasswordService = async (password, confirmPassword, token) => {

  // validate data
  if (password !== confirmPassword) {
    throwError(400, "Password & Confirm Password does not match");
  }

  // get user Details from DB using token
  const userDetails = await User.findOne({ token: token });

  // If no entry
  if (!userDetails) {
    throwError(401, "Token is invalid");
  }

  // check token expiry
  if (userDetails.resetPasswordExpires < Date.now()) {
    throwError(401, "Token is expired. Please regenerate your token");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // update password
  await User.findOneAndUpdate(
    { token: token },
    { password: hashedPassword },
    { new: true },
  );
};