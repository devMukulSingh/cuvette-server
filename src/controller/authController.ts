import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { sendEmailOtp, sendPhoneOtp } from "../lib/utils";
import { jwtSign } from "../lib/jwt";

export const sendOtpController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, phone, companyName, companyEmail, employeeSize } = req.body;

    if (!name)
      return res.status(400).json({
        error: "Name is required",
      });
    if (!phone)
      return res.status(400).json({
        error: "phone is required",
      });
    if (!companyName)
      return res.status(400).json({
        error: "companyName is required",
      });
    if (!companyEmail)
      return res.status(400).json({
        error: "companyEmail is required",
      });
    if (!employeeSize)
      return res.status(400).json({
        error: "employeeSize is required",
      });

    const isUserExists = await prisma.user.findFirst({
      where: {
        OR: [
          {
            companyEmail,
            phone,
          },
        ],
      },
    });

    if (isUserExists?.isEmailVerified && isUserExists.isPhoneVerified) {
      const {
        companyEmail,
        companyName,
        employeeSize,
        id,
        isEmailVerified,
        isPhoneVerified,
        name,
        phone,
      } = isUserExists;
      const token = await jwtSign();
      return res.status(200).json({
        msg: "User already exists",
        data: {
          id,
          name,
          phone,
          companyEmail,
          companyName,
          employeeSize,
          isEmailVerified,
          isPhoneVerified,
          token,
        },
      });
    }

    const emailOtp = await sendEmailOtp(companyEmail);
    const phoneOtp = await sendPhoneOtp(phone);

    if (!emailOtp) return res.status(500).json({ error: "Email otp not send" });
    if (!phoneOtp)
      return res.status(500).json({ error: "phone Otp  not send" });

    if (isUserExists) {
      await prisma.user.update({
        where: {
          companyEmail,
          phone,
        },
        data: {
          emailOtp,
          phoneOtp,
        },
      });
      return res.status(201).json({ msg: "otp sent", data: {} });
    }

    const newUser = await prisma.user.create({
      data: {
        companyEmail,
        companyName,
        employeeSize,
        name,
        phone,
        emailOtp,
        phoneOtp,
      },
    });
    const { id, isEmailVerified, isPhoneVerified } = newUser;
    return res.status(201).json({
      msg: "otp sent",
      data: {
        id,
        isEmailVerified,
        isPhoneVerified,
        companyEmail,
        companyName,
        employeeSize,
        name,
        phone,
      },
    });
  } catch (e) {
    console.log(`error:"Internal server error in SignupController`, e);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const verifyEmailOtpController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { emailOtp, companyEmail } = req.body;

    if (!emailOtp)
      return res.status(400).json({
        error: "Email otp is required",
      });
    if (!companyEmail)
      return res.status(400).json({
        error: "Company email  is required",
      });

    const user = await prisma.user.findFirst({
      where: {
        emailOtp,
        companyEmail,
      },
    });

    if (!user)
      return res.status(400).json({
        error: "invalid Otp",
      });
    await prisma.user.update({
      where: {
        companyEmail,
      },
      data: {
        isEmailVerified: true,
      },
    });
    const {
      companyName,
      employeeSize,
      id,
      isEmailVerified,
      isPhoneVerified,
      phone,
      name,
    } = user;

    if (user.isPhoneVerified) {
      const token = await jwtSign();
      const response = res
        .cookie("token", token, {
          sameSite: "none",
          secure: true,
          expires: new Date(Date.now() + 24 * 3600000 * 7),
        })
        .status(200)
        .json({
          data: {
            token,
            companyEmail,
            companyName,
            employeeSize,
            id,
            isEmailVerified,
            isPhoneVerified,
            phone,
            name,
          },
          msg: "Phone and email verified",
        });
      return response;
    }

    return res.status(200).json({
      msg: "Email Otp verified",
      data: {
        companyEmail,
        companyName,
        employeeSize,
        id,
        isEmailVerified,
        isPhoneVerified,
        phone,
        name,
      },
    });
  } catch (e) {
    console.log(`error:"Internal server error in verifyEmailOtpController`, e);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const verifyPhoneOtpController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { phoneOtp, phone } = req.body;

    if (!phone)
      return res.status(400).json({
        error: "phone is required",
      });
    if (!phoneOtp)
      return res.status(400).json({
        error: "phone Otp  is required",
      });

    const user = await prisma.user.findFirst({
      where: {
        phoneOtp,
        phone,
      },
    });

    if (!user)
      return res.status(400).json({
        error: "invalid Otp",
      });

    await prisma.user.update({
      where: {
        phone,
      },
      data: {
        isPhoneVerified: true,
      },
    });
    const {
      companyName,
      employeeSize,
      id,
      isEmailVerified,
      isPhoneVerified,
      companyEmail,
      name,
    } = user;
    if (user.isEmailVerified) {
      const token = await jwtSign();
      const response = res
        .cookie("token", token, {
          sameSite: "none",
          secure: true,
          expires: new Date(Date.now() + 24 * 3600000 * 7),
        })
        .status(200)
        .json({
          data: {
            companyEmail,
            companyName,
            employeeSize,
            id,
            isEmailVerified,
            isPhoneVerified,
            phone,
            name,
            token,
          },
          msg: "Phone and email verified",
        });
      return response;
    }
    return res.status(200).json({
      msg: "Phone Otp verified",
      data: {
        companyEmail,
        companyName,
        employeeSize,
        id,
        isEmailVerified,
        isPhoneVerified,
        phone,
        name,
      },
    });
  } catch (e) {
    console.log(`error:"Internal server error in verifyPhoneOtpController`, e);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
