import nodemailer from 'nodemailer';
import twilio from 'twilio'
import dotenv from 'dotenv';
dotenv.config();

// SMTP Configuration for Gmail
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || '587';
const SMTP_USER = process.env.SMTP_USER as string;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD as string;

const accountSid = process.env.TWILIOACCOUNTSID;
const authToken = process.env.TWILIOAUTHTOKEN;
const twilioPhoneNumber = process.env.TWILIOPHONENO;

// Create SMTP transporter for Gmail
const smtpTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const email_verification_mail = async (
  response: { email: string; fullName?: string; },
  otp: number
): Promise<string> => {
  try {
    if (!response?.email || response.email.trim() === "") {
      console.error("No recipient email provided in:", response);
      throw new Error("Recipient email is missing");
    }

    // Check if SMTP credentials are configured
    if (!SMTP_USER || !SMTP_PASSWORD) {
      console.error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD environment variables.");
      throw new Error("SMTP credentials not configured");
    }

    const mailOptions = {
      from: `"Quick Plant" <${SMTP_USER}>`,
      to: response.email,
      subject: 'Quick Plant - Email Verification',
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f2f3f8; padding: 0; margin: 0; }
              .container { max-width: 700px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
              h1 { color: #28a745; text-align: center; }
              p { font-size: 16px; color: #333; line-height: 1.6; }
              .otp { font-size: 22px; color: #000; font-weight: bold; text-align: center; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
              .footer { text-align: center; margin-top: 20px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Quick Plant</h1>
              <p>Hello ${(response.fullName || 'User')},</p>
              <p>Thank you for signing up. Use the OTP below to verify your email. It expires in <strong>10 minutes</strong>.</p>
              <div class="otp">${otp}</div>
              <p>If you didn't request this, just ignore this email.</p>
              <div class="footer">
              <p>– The Quick Plant Team</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await smtpTransporter.sendMail(mailOptions);
    return `Verification email sent to ${response.email}`;
  } catch (error) {
    console.error('SMTP Email send error:', error);
    throw new Error('Failed to send verification email');
  }
};

const client = twilio(accountSid, authToken);

export const otp_verification_sms = async (
  response: { mobileNo: string; fullName?: string },
  otp: number
): Promise<string> => {
  try {
    // Check if Twilio credentials are configured
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error("Twilio credentials not configured. Please set TWILIOACCOUNTSID, TWILIOAUTHTOKEN, and TWILIOPHONENO environment variables.");
      throw new Error("Twilio credentials not configured");
    }

    const smsBody = `Hello ${response.fullName || 'User'}, your Quick Plant OTP is: ${otp}. It expires in 10 minutes.`;

    const message = await client.messages.create({
      body: smsBody,
      from: twilioPhoneNumber,
      to: `+91${response.mobileNo}`, // Add country code if not present
    });

    console.log('SMS sent SID:', message.sid);
    return `OTP SMS sent to ${response.mobileNo}`;
  } catch (error: any) {
    console.error('SMS send error:', error.message || error);
    throw new Error('Failed to send OTP SMS');
  }
};

// export const sendResetPasswordMail = async ({
//   email,
//   fullName,
//   resetLink,
// }: {
//   email: string;
//   fullName: string;
//   resetLink: string;
// }) => {
//   try {
//     const mailOptions = {
//       from: `Quick Plant <${SMTP_USER}>`,
//       to: email,
//       subject: 'Reset Your Password - Quick Plant',
//       html: `
//         <div style="font-family:Arial,sans-serif;line-height:1.5;color:#333">
//           <h2>Hello, ${fullName}</h2>
//           <p>You recently requested to reset your password for your Quick Plant account.</p>
//           <p>Click the button below to reset it:</p>
//           <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
//           <p>If you did not request a password reset, please ignore this email.</p>
//         </div>
//       `,
//     };

//     await smtpTransporter.sendMail(mailOptions);
//   } catch (error: any) {
//     console.error('SMTP Email send error:', error);
//     throw new Error('Failed to send reset password email');
//   }
// };

export const sendEmailResetOtp = async (
  response: { email: string; fullName?: string },
  otp: number
): Promise<string> => {
  try {
    if (!response.email || response.email.trim() === "") {
      throw new Error("Recipient email is missing");
    }

    if (!SMTP_USER || !SMTP_PASSWORD) {
      throw new Error("SMTP credentials not configured");
    }

    const mailOptions = {
      from: `"Quick Plant" <${SMTP_USER}>`,
      to: response.email,
      subject: 'Quick Plant - Password Reset OTP',
      html: `
  <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#333;padding:20px;border:1px solid #e0e0e0;border-radius:8px;background:#f9f9f9">
    <div style="text-align:center;margin-bottom:20px;">
      <h1 style="color:#2e7d32;margin:0;">Quick Plant</h1>
      <p style="font-size:14px;color:#777;margin:5px 0 0;">Password Reset OTP</p>
    </div>
    <p style="font-size:16px;">Hi ${response.fullName || 'User'},</p>
    <p style="font-size:15px;">We received a request to reset your password for your Quick Plant account.</p>
    <p style="font-size:15px;">Please use the OTP below to reset your password:</p>
    <div style="text-align:center;margin:20px 0;">
      <span style="display:inline-block;font-size:24px;font-weight:bold;background:#e8f5e9;color:#2e7d32;padding:12px 24px;border-radius:6px;letter-spacing:4px;">${otp}</span>
    </div>
    <p style="font-size:14px;color:#555;">This OTP is valid for <strong>30 seconds</strong>. Do not share this OTP with anyone.</p>
    <p style="font-size:14px;color:#555;">If you did not request a password reset, please ignore this email.</p>
    <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
    <p style="font-size:12px;color:#aaa;text-align:center;">© ${new Date().getFullYear()} Quick Plant. All rights reserved.</p>
  </div>
`,
    };

    await smtpTransporter.sendMail(mailOptions);
    return `OTP sent to ${response.email}`;
  } catch (error: any) {
    console.error('sendEmailResetOtp error:', error.message);
    throw new Error('Failed to send OTP to email');
  }
};

export const sendSmsResetOtp = async (
  response: { mobileNo: string; fullName?: string },
  otp: number
): Promise<string> => {
  try {
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error("Twilio credentials not configured");
    }

    const smsBody = `Hi ${response.fullName || 'User'}, your Quick Plant password reset OTP is: ${otp}. It is valid for 30 seconds.`;

    const message = await client.messages.create({
      body: smsBody,
      from: twilioPhoneNumber,
      to: `+91${response.mobileNo}`,
    });

    console.log('OTP SMS sent SID:', message.sid);
    return `OTP sent to ${response.mobileNo}`;
  } catch (error: any) {
    console.error('sendSmsResetOtp error:', error.message || error);
    throw new Error('Failed to send OTP to mobile');
  }
};