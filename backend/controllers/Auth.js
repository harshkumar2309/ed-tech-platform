import { User } from "../models/User.js";
import { OTP } from "../models/OTP.js";
import otpGenerator from "otp-generator";


// send otp
export const sendOTP = async (req, res) => {

    try{

    // fetch email from body of request
    const { email } = req.body;

    // check if user already exist
    const checkUser = await User.findOne({email});

    // if user already exists
    if(checkUser){
        return res.status(401).json({
            success: false,
            message: 'User already registered',
        })
    }

    // generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP generated: ", otp );

    // check unique otp or not
    let result = await OTP.findOne({otp: otp});

    while(result){
        otp = otpGenerator(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        result = await OTP.findOne({otp: otp}); 
    }

    // store generated otp in DB
    const otpPayload = {email, otp};

    // create an entry in DB for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // return response successfully
    res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        otp,
    });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// signup

// login

// change password
