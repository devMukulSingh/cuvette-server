import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
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
    let emailOtp = Math.floor(Math.random() * 10000);
    while (emailOtp.toString().length !== 4) {
      emailOtp = Math.floor(Math.random() * 10000);
      console.log(emailOtp);
    }
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
    let phoneOtp = Math.floor(Math.random() * 10000);
    while (phoneOtp.toString().length !== 4) {
      phoneOtp = Math.floor(Math.random() * 10000);
      console.log(phoneOtp);
    }
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


export async function sendMultipleMails({ candidatesEmail, subject, message }: { candidatesEmail: string, subject: string, message: string }) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "mukulsingh2276@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    });
    const mailOptions = {
      from: "mukulsingh2276@gmail.com",
      to: candidatesEmail,
      subject,
      html: message,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email otp send`);
    return info;
  } catch (e:any) {
    console.log(`Error in sendEmailOtp `, e);
  }
}