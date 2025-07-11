"use strict"
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Debug logging
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '[OK]' : '[MISSING]');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '[OK]' : '[MISSING]');
console.log('AWS_REGION:', process.env.AWS_REGION || '[MISSING]');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-south-1',
});

const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

// ✅ FINAL OTP SMS FUNCTION (No subscription!)
export const sendSMS = async (countryCode: string, number: string, otp: string, fullName?: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const phoneNumber = `+${countryCode}${number}`; // no spaces
      const message = `Hello ${fullName || 'User'}, your Quick Plant OTP is: ${otp}. It expires in 10 minutes.`;
      const params = {
        Message: message,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional',
          },
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: 'QuickPlant', // Max 11 characters
          },
        },
      };
      const result = await sns.publish(params).promise();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
