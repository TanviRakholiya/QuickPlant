"use strict"
import AWS from 'aws-sdk'
import dotenv from 'dotenv'
dotenv.config()

// Required .env variables:
// AWS_ACCESS_KEY_ID=your_aws_access_key_id
// AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
// AWS_REGION=ap-south-1

// Debug logging to verify environment variables
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '[OK]' : '[MISSING]')
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '[OK]' : '[MISSING]')
console.log('AWS_REGION:', process.env.AWS_REGION ? process.env.AWS_REGION : '[MISSING]')

AWS.config.update({ region: process.env.AWS_REGION || 'ap-south-1' })
console.log(process.env.AWS_REGION)

// Check for credentials and log a clear error if missing
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('Missing AWS credentials! Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file.')
}

// const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
// // const params = {
// //     attributes: { DefaultSMSType: 'Transactional', DefaultSenderID: 'PVR pristine' },
// // }

// // const SNS_TOPIC_ARN = 'arn:aws:sns:ap-south-1:081890807861:PVR_pristine';

// const SNS_TOPIC_ARN = 'arn:aws:sns:ap-south-1:680146243022:zazzi_sns'

// export const sendSMS = async (countryCode: any, number: any, SMS_template: any) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (countryCode && number) {
//                 number = `+${countryCode} ${number}`
//                 await sns.subscribe(
//                     {
//                         Protocol: 'SMS',
//                         TopicArn: SNS_TOPIC_ARN,
//                         Endpoint: number,
//                     },
//                     async function (error, data) {
//                         if (error) {
//                             console.log('');
//                             console.log(error);
//                         }
//                         var params = {
//                             Message: SMS_template,
//                             PhoneNumber: number,
//                             MessageAttributes: {
//                                 'AWS.SNS.SMS.SMSType': {
//                                     DataType: 'String',
//                                     StringValue: 'Transactional',
//                                 },
//                                 'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: 'abc' }
//                             }
//                         };
//                         await sns.publish(params, function (err_publish, data) {
//                             if (err_publish) {
//                                 console.log(err_publish);
//                                 reject(err_publish);
//                             } else {
//                                 resolve(data);
//                             }
//                         });
//                     }
//                 );
//             }
//             else {
//                 resolve(true)
//             }
//         } catch (error) {
//             reject(error)
//         }
//     });
// }

export const sendSMSTest = async (countryCode: any, number: any, SMS_template: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (countryCode && number) {
                number = `+${countryCode} ${number}`
                var params = {
                    Message: SMS_template,
                    PhoneNumber: number,
                };
                var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
                publishTextPromise.then(
                    function (data) {
                        console.log("MessageID is " + data.MessageId);
                    }).catch(
                        function (err) {
                            console.error(err, err.stack);
                        });
            }
            else {
                resolve(true)
            }
        } catch (error) {
            reject(error)
        }
    });
}

const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

const SNS_TOPIC_ARN = 'arn:aws:sns:ap-south-1:081890807861:zazzi';
export const sendSMS = async (countryCode: any, number: any, otp: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            number = `+ ${countryCode} ${number}`
            console.log(number);
            await sns.subscribe(
                {
                    Protocol: 'SMS',
                    TopicArn: SNS_TOPIC_ARN,
                    Endpoint: number,
                },
                async function (error, data) {
                    if (error) {
                        console.log('Error in subscribe');
                        // console.log(error);
                    }
                    var params = {
                        Message: otp,
                        PhoneNumber: number,
                        MessageAttributes: {
                            'AWS.SNS.SMS.SMSType': {
                                DataType: 'String',
                                StringValue: 'Transactional',
                            },
                            'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: 'DeathFolder' }
                        }
                    };
                    // console.log('params:', params);
                    await sns.publish(params, function (err_publish, data) {
                        if (err_publish) {
                            // console.log(err_publish);
                            reject(err_publish);
                        } else {
                            // console.log(data);
                            resolve(data);
                        }
                    });
                }
            );
        } catch (error) {
            console.log(error)
            reject(error)
        }
    });
}