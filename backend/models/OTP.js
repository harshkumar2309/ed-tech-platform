import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender";


const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5*60,
  },
});

// a function to send mail
async function sendVerificationEmail(email, otp){
  try{
    const mailResponse = await mailSender(email, "Verification Email from SkillForge", otp);

    console.log("Email sent Successfully: ", mailResponse);

  } catch(error){
    console.log("Error while sending mail: ", error);
    throw error;
  }
}

export const OTP = mongoose.model("OTP", OTPSchema);
