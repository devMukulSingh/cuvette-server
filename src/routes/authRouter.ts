import { Router } from "express";
import {
  sendEmailOtpController,
  sendOtpController,
  verifyEmailOtpController,
  verifyPhoneOtpController,
} from "../controller/authController";

const authRouter = Router();

authRouter.post(`/sign-up/send-otp`, sendOtpController);
authRouter.post(`/sign-up/verify-emailotp`, verifyEmailOtpController);
authRouter.post(`/sign-up/verify-phoneotp`, verifyPhoneOtpController);

authRouter.post(`/sign-in/send-otp`, sendEmailOtpController);
authRouter.post(`/sign-in/verify-otp`, verifyEmailOtpController);

export default authRouter;
