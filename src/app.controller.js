import express from "express";
import { getEnv } from "../config/env.service.js";
import { globalHandlingError } from "./common/responce/error.responce.js";
import {
  hashWord,
  compareWord,
} from "./common/middleware/security/HashWord.js";
import { connectDB } from "./database/connection.js";
import  authRouter  from "./modules/auth/auth.controller.js";
import { connectRS } from "./database/redisConnection.js";
import { otpGenerator } from "./common/utils/otp.js"
import userRouter from "./modules/user/user.controller.js"
import cors from "cors"
import messageRouter from "./modules/message/message.controller.js";

export const bootstrap = async () => {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
    }),
  );
  app.use(globalHandlingError);
  const yourWord = "mySecretPassword";
  const hashedWord = await hashWord(yourWord);
  console.log(`Hashed Word: ${hashedWord}`);

  const isMatch = await compareWord(yourWord, hashedWord);
  console.log(`Password Match: ${isMatch}`);
  await connectDB();
  await connectRS()
// const otp = otpGenerator();
// console.log(`Generated OTP: ${otp}`);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);


  app.listen(getEnv("PORT"), () => {
    console.log(`Server is running on port ${getEnv("PORT")}`);
  });
};
