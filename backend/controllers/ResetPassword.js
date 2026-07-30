import { User } from "../models/User";
import { mailSender } from "../utils/mailSender";

// resetPassword token
export const resetPasswordToken = async (req, res) => {
  try {
    // get email
    const email = req.body.email;

    // validate email
    const userExist = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Your Email is not registered with us.",
      });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");

    // update user by adding token & expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: 5 * 60 * 1000,
      },
      { new: true },
    );

    // create url link
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`,
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully, please check on the registerd email",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while sending email",
    });
  }
};


// resetPassword
export const resetPassword = (req, res) => {

    try{

        // fetch data
        const { password, confirmPassword, token } = req.body

        // validate data
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: 'Password does not match',
            })
        }

        // get user details using token
        const userDetails = await User.findOne({
            token: token
        });

        // if no entry - invalid token
        if(!userDetails){
            return res.json({
                success: false,
                message: 'Invalid token',
            });
        }

        // token expiry check
        if(userDetails.resetPasswordExpires > Date.now() ){
            return res.json({
                success: false,
                message: 'Token has been expired, please regenerate link.',
            });
        }
        // hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password and store in DB
        await User.findOneAndUpdate(
            { password: hashedPassword },
            { token : token },
            { new : true },
        )

        // return response
        return res.status(200).json({
                success: true,
                message: 'Password has been reset Successfully!',
        });
    } catch(err){
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while reset password',
        })}
    }