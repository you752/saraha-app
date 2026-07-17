import { Router } from "express";
import {
  signup,
  login,
  verifyUser,
  resendOtp,
  logout,
  signupMail,
} from "./auth.service.js";
import { SuccessResponse } from "../../common/responce/success.responce.js";
import { validate } from "../../common/vaildation/vaildation.js";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { loginRateLimit, sendOtpRateLimit } from "../../common/middleware/rateLimit/rateLimit.js";
import { auth } from "../../common/middleware/auth/auth.js";
const router = Router();

router.post("/signup", validate(signupSchema), async (req, res) => {
  let createAccount = await signup(req.body);
  SuccessResponse({res,message: "user added successflly",data: createAccount,});
});

router.post("/signup/gmail", async (req, res) => {
  const data = await signupMail(req.body)
    SuccessResponse({
      res,
      message: "user added successflly",
      data: data,
    });
});

router.post("/verifyAccount", async (req, res) => {
  let userData = await verifyUser(req.body);
  SuccessResponse({
    res,
    message: "user verify is successfully",
    data: userData,
  });
});


router.post("/login", loginRateLimit, validate(loginSchema), async (req, res) => {
  let loginAccount = await login(req.body);
   SuccessResponse({res,message: "user login successflly",data: loginAccount,});
 })


router.post("/resendOtp",sendOtpRateLimit ,async (req, res) => {
  let userData = await resendOtp(req.body);
  SuccessResponse({
    res,
    message: "user verify is successfully",
    data: userData,
  });
});

router.post("/logout", auth(), async (req, res) => {
  const result = await logout(req);
  SuccessResponse({
    res,
    message: "logout successfully",
    data: result,
  });
});






export default router;
