import { Router } from "express";
import {
  sendOtpController,
  verifyEmailOtpController,
  verifyPhoneOtpController,
} from "../controller/authController";

const authRouter = Router();

authRouter.post(`/sign-up/send-otp`, sendOtpController);
authRouter.post(`/sign-up/verify-emailotp`, verifyEmailOtpController);
authRouter.post(`/sign-up/verify-phoneotp`, verifyPhoneOtpController);

export default authRouter;
