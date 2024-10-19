import nodemailer from "nodemailer";
import twilio from "twilio";

export const base_url_client =
  process.env.NODE_ENV === "production"
    ? "https://cuvette-client.vercel.app"
    : "http://localhost:5173";

export async function sendEmailOtp(companyEmail: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "mukulsingh2276@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    });
    const emailOtp = Math.floor(Math.random() * 10000);
    console.log(emailOtp);
    const mailOptions = {
      from: "mukulsingh2276@gmail.com",
      to: companyEmail,
      subject: "verify Your email",
      html: `<p>Enter the otp ${emailOtp} to verify your email</p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email otp send`);

    return emailOtp;
  } catch (e) {
    console.log(`Error in sendEmailOtp `, e);
  }
}

export async function sendPhoneOtp(phone: string) {
  try {
    const phoneOtp = Math.floor(Math.random() * 10000);
    const client = twilio(
      process.env.TWILIO_SSID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    const message = await client.messages.create({
      body: `Enter Otp ${phoneOtp} to verify your account `,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });
    console.log(`Phone otp send`);
    return phoneOtp;
  } catch (e) {
    console.log(`Error in sendPhoneOtp`, e);
  }
}
