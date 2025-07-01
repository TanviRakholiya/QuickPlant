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