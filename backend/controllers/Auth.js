import { User } from "../models/User.js";
import { Profile } from "../models/Profile.js";
import { OTP } from "../models/OTP.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";


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
export const signUp = async (req, res) => {
    try{
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

        if(!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber){
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
              success: false,
              message:
                "Password and Confirm Password value does not match, please try again.",
            });
        }

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({
              success: false,
              message: "User is already registered.",
            });
        }

        // find the most recent OTP stored in DB for the user
        const recentOtp = await OTP.findOne({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp);
        if(recentOtp.length === 0){
            // Otp not found
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        } else if(otp !== recentOtp){
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create entry in DB
        
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

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

        // return response
        return res.status(200).json({
            success: true,
            message: 'User is registered Successfully',
            newUser,
        });
    } catch(error){
        console.log(error); 
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again",
        })
    }
}

// login

// change password
