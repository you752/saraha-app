import userModel from "../../database/models/user.model.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../common/responce/error.responce.js";
import {
  hashWord,
  compareWord,
} from "../../common/middleware/security/HashWord.js";
import { generateToken } from "../../common/middleware/auth/auth.js";
import { otpGenerator } from "../../common/utils/otp.js";
import { sendEmail } from "../../common/utils/sendMail.js";
import { clientRedius } from "../../database/redisConnection.js";
import { EncryptWord } from "../../common/middleware/security/phoneCrypto.js";
import { revokeToken } from "../../common/utils/redis.service.js";
import { OAuth2Client } from "google-auth-library";
import { getEnv } from "../../../config/env.service.js";


export const signup = async (data) => {
  const {
    name,
    unique_name,
    email,
    password,
    phone,
    age,
    gender,
    profile_image,
  } = data;

  if (!name || !unique_name || !email || !password) {
    throw BadRequestException({
      message: "please enter all data",
    });
  }

  const isUserExist = await userModel.findOne({
    $or: [{ email }, { unique_name }],
  });

  if (isUserExist) {
    throw ConflictException({
      message: "user already exist",
    });
  }

  const hashedPassword = await hashWord(password);
  const Encryptphone = await EncryptWord(phone);

  const newUser = await userModel.create({
    name,
    unique_name,
    email,
    password: hashedPassword,
    phone: Encryptphone,
    age,
    gender,
    profile_image,
    is_verified: false, 
  });

  const otp = otpGenerator();

  const hashedOtp = await hashWord(String(otp));
  await clientRedius.set(`otp:${email}`, hashedOtp, {
    EX: 600,
  });

  await sendEmail({
    to: email,
    subject: "Verify your account",
    text: `Hello ${unique_name},\n\nYour OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.`,
    html: `Your OTP is <h2>${otp}</h2>`,
  });

  return {
    success: true,
    message: "Account created successfully. Please verify your email.",
  };
};

export const signupMail = async(body)=>{
  const client = new OAuth2Client()
  const ticket = await client.verifyIdToken({
    idToken: body.idToken,
    audience: getEnv("GOOGLE_CLIENT_ID"),
  });
  const paylod = ticket.getPayload()
  if(!paylod.email_verified)
  {
throw BadRequestException({
    message:"email not verified"
})
  }
  let{email,name}=paylod
  let existUser = await userModel.find({email})
  if(existUser)
  {
    throw ConflictException({
        message:"user is already exists"
    })
  }
  let addUser = await userModel.insertOne({
    provider:"google",
    name,
    email,
    is_verified:true
  });
  return addUser
  
}

export const verifyUser = async (data) => {
  const { email, otp } = data;

  if (!email || !otp) {
    throw BadRequestException({
      message: "please enter all data",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw NotFoundException({
      message: "user not found",
    });
  }

  const storedOtp = await clientRedius.get(`otp:${email}`);

  if (!storedOtp) {
    throw BadRequestException({
      message: "OTP has expired or is invalid",
    });
  }

  
  const isOtpMatch = await compareWord(String(otp), storedOtp);

  if (!isOtpMatch) {
    throw BadRequestException({
      message: "Invalid OTP",
    });
  }

  user.is_verified = true; 
  await user.save();

  await clientRedius.del(`otp:${email}`);

  return {
    success: true,
    message: "Account verified successfully",
  };
};

export const login = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw BadRequestException({
      message: "please enter all data",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw NotFoundException({
      message: "user not found",
    });
  }

  const isPasswordMatch = await compareWord(password, user.password);

  if (!isPasswordMatch) {
    throw BadRequestException({
      message: "incorrect password",
    });
  }

  if (!user.is_verified) {
  
    throw BadRequestException({
      message: "user not verified",
    });
  }

  const tokens = await generateToken(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    user.role,
  );

  return {
    success: true,
    message: "login success",
    ...tokens,
    user,
  };
};

export const resendOtp = async (data) => {
  const { email } = data;
  const userData = await userModel.findOne({ email });
  if (!userData) {
    throw NotFoundException({ message: "Account does not exist" });
  }

  if (userData.is_verified) {
    throw BadRequestException({ message: "Account already verified" });
  }

  
  const otp = otpGenerator();
  const hashedOtp = await hashWord(String(otp));

  
  await clientRedius.set(`otp:${email}`, hashedOtp, {
    EX: 600,
  });

  await sendEmail({
    to: email,
    subject: "Verify your account",
    text: `Your OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.`,
    html: `Your OTP is <h2>${otp}</h2>`,
  });

  return { message: "OTP resent successfully" };
};

export const logout = async (req) => {
  await revokeToken(req.token);

  return {
    message: "Logout successfully",
  };
};
