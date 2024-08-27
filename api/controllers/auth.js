import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import validator from "validator";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const register = async (req, res, next) => {
  try {
    if(!req.body.firstname ||
      !req.body.email ||
      !req.body.passportNo ||
      !req.body.country ||
      !req.body.phone ||
      !req.body.password){
      return next(createError(400, "Please fill in all of the required fields!"));
    }

    if(!validator.isEmail(req.body.email)){
      return next(createError(400, "Email is not valid."));
    }

    const checkEmailExists = await User.findOne({ email: req.body.email });
    if(checkEmailExists){
      return next(createError(400, "Email has already been used."));
    }

    const checkPassport = await User.findOne({ passportNo: req.body.passportNo });
    if(checkPassport){
      return next(createError(400, "Passport has already been used."));
    }

    const checkPhone = await User.findOne({ phone: req.body.phone });
    if(checkPhone){
      return next(createError(400, "Phone number has already been used."));
    }
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const verificationToken = Math.floor(100000 + Math.random() * 900000);
    console.log(verificationToken);

    const newUser = new User({
      ...req.body,
      password: hash,
      verificationToken,
      isVerified: false,
      isPasswordChanged: false,
      verifyAttempts: 0
    });
    await newUser.save();

    const config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }; 

    const transporter = nodemailer.createTransport(config);
    const logoPath = path.join(__dirname, '../assets/logo.png');
    const htmlMsg = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Account Registration Notification</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

            body {
                font-family: 'Poppins', sans-serif;
                background-color: #f6f6f6;
                margin: 0;
                padding: 0;
                color: #333333;
            }

            .email-wrapper {
                max-width: 600px;
                margin: 20px auto;
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .email-heading {
                background-color: rgb(56, 245, 245);
                padding: 20px;
                text-align: center;
            }

            .email-heading h1 {
                margin: 0;
                color: #fff;
                font-weight: 600px;
            }

            .email-body {
                padding: 30px;
            }

            .email-body img {
                display: block;
                max-width: 100%;
                height: auto;
                width: 300px;
                margin: 0 auto;
            }

            .email-body h2 {
                font-size: 24px;
                color: #333;
                margin-top: 0;
            }

            .email-body p {
                font-size: 16px;
                line-height: 1.5;
                color: #555555;
                margin-top: 25px;
            }

            .email-table {
                width: 100%;
                margin: 20px 0;
                border-collapse: collapse;
            }

            .email-table th, .email-table td {
                padding: 12px;
                border: 1px solid #ddd;
                text-align: center;
            }

            .footer {
                text-align: center;
                font-size: 14px;
                padding: 20px;
                background-color: #222222;
                color: #fff;
            }

            .footer a {
                text-decoration: none;
            }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
            <div class="email-heading">
                <h1>Villa Rumah Nyaman</h1>
            </div>
            <div class="email-body">
                <img src="cid:logo">
                <h2>Hello, ${req.body.firstname} ${req.body.lastname}</h2>
                <p>Welcome to the Villa Rumah Nyaman Platform. Please use the following token to verify your account.</p>
                <table class="email-table">
                    <tr>
                        <th>Item</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>Account Verification Token</td>
                        <td>${verificationToken}</td>
                    </tr>
                </table>
                <p>If you did not create the account. No further action is required.</p>
                <p><br>Yours truly, <br>Villa Rumah Nyaman</p>
            </div>
            <div class="footer">
                &copy; 2024 <a href="#">Villa Rumah Nyaman</a>. All rights reserved.
            </div>
        </div>
      </body>
      </html>
    `;

    const message = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Account Verification",
      html: htmlMsg,
      attachments: [{
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo'
      }]
    }

    await transporter.sendMail(message); 
    res.status(200).json("User has been created. Please check your email to complete the verification process.");
  } catch (err) {
    next(err);
  }
};

export const verifyAccount = async (req, res, next) => {
  const { email, token } = req.body;

  try {
      if(!email || !token){
        return next(createError(400, "Please fill in all of the required fields!"));
      }

      const user = await User.findOne({ email });
      if(!user){
        return next(createError(400, "User is not found in the system!"));
      }    

      // Check if the user has already verified to the system.
      if(user.isVerified){
        return next(createError(400, "You have verified your account already."));
      }

      const tokenNum = parseInt(token, 10);
      if(user.verificationToken !== tokenNum){
          if(user.verifyAttempts >= 5){
              await User.findByIdAndDelete(user._id);
              return next(createError(404, "Too many incorrect attempts. Cancelling the registration process."));
          }
          user.verifyAttempts += 1;
          await user.save();
          return next(createError(400, "Invalid token inserted!"));
      }
      user.isVerified = true;
      user.verificationToken = null;
      user.verifyAttempts = 0;

      await user.save();
      res.status(200).json("Successfully verified the account."); 
  } catch(err){
    next(err);
  }
} 

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};

export const check = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect){
      return next(createError(400, "Wrong password or username!"));
    }

    res.status(200).send("email and password correct.")
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    if(!email){
      return next(createError(400, "Please fill in all of the required fields!"));
    }

    if(!validator.isEmail(email)){
      return next(createError(400, "Sorry, email format is not valid."));
    }

    const user = await User.findOne({ email });
    if(!user){
      return next(createError(400, "Sorry, user is not found in the system."));
    }

    if(!user.isVerified){
      return next(createError(404, "This account hasn't been verified yet. Please complete the verification process."))
    }

    // Generate a 6-digit reset password token
    const resetPasswordToken = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordToken = resetPasswordToken;
    user.verifyAttempts = 0;

    let firstName = user.firstname;
    let lastName = user.lastname;

    const config = {
      service: 'gmail',
      auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_APP_PASSWORD
      }
  };

  const transporter = nodemailer.createTransport(config);
  const logoPath = path.join(__dirname, '../assets/logo.png');

  const htmlMsg = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password Notification</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
  
              body {
                  font-family: 'Poppins', sans-serif;
                  background-color: #f6f6f6;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }

              .email-wrapper {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: white;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }

              .email-heading {
                  background-color: rgb(56, 245, 245);
                  padding: 20px;
                  text-align: center;
              }

              .email-heading h1 {
                  margin: 0;
                  color: #fff;
                  font-weight: 600px;
              }

              .email-body {
                  padding: 30px;
              }

              .email-body img {
                  display: block;
                  max-width: 100%;
                  height: auto;
                  width: 300px;
                  margin: 0 auto;
              }

              .email-body h2 {
                  font-size: 24px;
                  color: #333;
                  margin-top: 0;
              }

              .email-body p {
                  font-size: 16px;
                  line-height: 1.5;
                  color: #555555;
                  margin-top: 25px;
              }

              .email-table {
                  width: 100%;
                  margin: 20px 0;
                  border-collapse: collapse;
              }

              .email-table th, .email-table td {
                  padding: 12px;
                  border: 1px solid #ddd;
                  text-align: center;
              }

              .footer {
                  text-align: center;
                  font-size: 14px;
                  padding: 20px;
                  background-color: #222222;
                  color: #fff;
              }

              .footer a {
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="email-wrapper">
              <div class="email-heading">
                  <h1>Villa Rumah Nyaman</h1>
              </div>
              <div class="email-body">
                  <img src="cid:logo">
                  <h2>Hello, ${firstName} ${lastName}</h2>
                  <p>Please use the following token to reset your password:</p>
                  <table class="email-table">
                      <tr>
                          <th>Item</th>
                          <th>Description</th>
                      </tr>
                      <tr>
                          <td>Reset Password Token</td>
                          <td>${resetPasswordToken}</td>
                      </tr>
                  </table>
                  <p>If you did not request this, please ignore this email.</p>
                  <p><br>Yours truly, <br>Villa Rumah Nyaman</p>
              </div>
              <div class="footer">
                  &copy; 2024 <a href="#">Villa Rumah Nyaman</a>. All rights reserved.
              </div>
          </div>
      </body>
      </html>
  `;

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Password",
    html: htmlMsg,
    attachments: [{
      filename: 'logo.png',
      path: logoPath,
      cid: 'logo'
    }]
  } 

    transporter.sendMail(message, (error, info) => {
        if(error){
            console.log(error);
            next(error);
        } else {
            console.log("Email sent: " + info.response);
            user.save().then(() => {
              res.status(200).json("Reset password token has been sent. Please check your email inbox.");
            }).catch(error => {
              console.log(error);
              next(error);
            });
        }
    });
  } catch(err){
    next(err);
  }
}

export const verifyResetPasswordRequest = async (req, res, next) => {
  const {
    email,
    resetPasswordToken,
    newPassword,
    confirmPassword
  } = req.body;

  try {
    const user = await User.findOne({ email });
    if(!user){
        return next(createError(400, "Sorry, user is not found in the system."));
    }

    // Check if the reset password token is correct
    if(user.resetPasswordToken !== resetPasswordToken){
        user.verifyAttempts += 1;
        if(user.verifyAttempts >= 5){
            user.resetPasswordToken = null;
            user.verifyAttempts = 0;
            await user.save();
            return next(createError(400, "Too many incorrect attempts! Please try it again later."));
        }
        await user.save();
        return next(createError(400, "Invalid reset password token! Please try again!"));
    }

    if(newPassword !== confirmPassword){
        return next(createError(400, "New password and confirmation password does not match."));
    }

    // Case if the token is correct and the new password along with the confirmation password matches
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    user.password = hash;
    await user.save();
    res.status(200).send("Successfully reset the password.");
  } catch(error){
    next(error);
  }
}