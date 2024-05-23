import nodemailer from 'nodemailer';

const sendEmail = async (email_to, statusCode) => {
    var transporter=nodemailer.createTransport({
        service:"gmail",
        host:"mail.gmail.com",
        port:465,
        secure:false,
        auth:{
            user:process.env.SENDER_MAIL,
            pass:process.env.SENDER_PASS
        }
    });
    var mailmsg=`
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
      <h1 style="color: #00aff5; font-size: 24px; text-align: center; margin-bottom: 20px;">Welcome to Car Go!</h1>
      <p style="font-size: 16px; line-height: 1.6;">Thank you for signing up. Your verification code is:</p>
      <div style="background-color: #00aff5; color: white; font-size: 36px; text-align: center; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        ${statusCode}
      </div>
      <p style="font-size: 16px; line-height: 1.6;">Please enter this code in the app to complete your registration.</p>
      <p style="font-size: 16px; line-height: 1.6;">If you did not sign up for our app, please ignore this email.</p>
      <p style="font-size: 16px; line-height: 1.6;">Best regards,<br>Car Go Team</p>
    </div>
  `;
    try{
        var info= await transporter.sendMail({
            from:"divyanshu0469.be21@chitkara.edu.in",
            to: email_to,
            subject:"Car Go Verification Code",
            html: mailmsg
        });
    }
    catch(err){
        console.log(err);
    }

    if(info.messageId)
        return true;
    else
        return false;
}

export default sendEmail;