import nodemailer from "nodemailer";

export const mailSender = async (email, title, body) => {
    try{
        // transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // send Mail
        let info = await transporter.sendMail({
            from: 'SkillForge',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })

        console.log(info);
        return info;
        
    } catch(error){
        console.log(error.message);  
    }
}
