// import nodemailer from 'nodemailer';
// import { Order } from '../database/models';

// // SMTP Configuration (reusing from mail.ts)
// const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
// const SMTP_PORT = process.env.SMTP_PORT || '587';
// const SMTP_USER = process.env.SMTP_USER as string;
// const SMTP_PASSWORD = process.env.SMTP_PASSWORD as string;

// const smtpTransporter = nodemailer.createTransporter({
//   host: SMTP_HOST,
//   port: parseInt(SMTP_PORT),
//   secure: false,
//   auth: {
//     user: SMTP_USER,
//     pass: SMTP_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// // Order confirmation email
// export const sendOrderConfirmationEmail = async (order: any, userEmail: string, userName: string) => {
//   try {
//     if (!SMTP_USER || !SMTP_PASSWORD) {
//       console.error("SMTP credentials not configured");
//       throw new Error("SMTP credentials not configured");
//     }

//     const mailOptions = {
//       from: `"Quick Plant" <${SMTP_USER}>`,
//       to: userEmail,
//       subject: `Order Confirmed - ${order.orderNumber}`,
//       html: `
//         <html>
//           <head>
//             <style>
//               body { font-family: Arial, sans-serif; background-color: #f2f3f8; padding: 0; margin: 0; }
//               .container { max-width: 700px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
//               .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #28a745; }
//               .logo { color: #28a745; font-size: 24px; font-weight: bold; }
//               .order-number { background: #28a745; color: white; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
//               .product-item { border: 1px solid #eee; padding: 15px; margin: 10px 0; border-radius: 5px; }
//               .product-name { font-weight: bold; color: #333; }
//               .product-price { color: #28a745; font-weight: bold; }
//               .total-section { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
//               .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
//               .total-amount { font-size: 18px; font-weight: bold; color: #28a745; }
//               .shipping-info { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
//               .footer { text-align: center; margin-top: 20px; color: #666; }
//             </style>
//           </head>
//           <body>
//             <div class="container">
//               <div class="header">
//                 <div class="logo">🌱 Quick Plant</div>
//                 <h2>Order Confirmed!</h2>
//               </div>
              
//               <p>Hello ${userName},</p>
//               <p>Thank you for your order! We're excited to bring some greenery to your space.</p>
              
//               <div class="order-number">
//                 Order Number: ${order.orderNumber}
//               </div>
              
//               <h3>Order Details:</h3>
//               ${order.products.map((item: any) => `
//                 <div class="product-item">
//                   <div class="product-name">${item.productId.name}</div>
//                   <div>Quantity: ${item.quantity}</div>
//                   <div class="product-price">₹${item.price}</div>
//                 </div>
//               `).join('')}
              
//               <div class="total-section">
//                 <div class="total-row">
//                   <span>Subtotal:</span>
//                   <span>₹${order.subtotal}</span>
//                 </div>
//                 ${order.discountAmount > 0 ? `
//                   <div class="total-row">
//                     <span>Discount:</span>
//                     <span>-₹${order.discountAmount}</span>
//                   </div>
//                 ` : ''}
//                 ${order.couponDiscount > 0 ? `
//                   <div class="total-row">
//                     <span>Coupon Discount:</span>
//                     <span>-₹${order.couponDiscount}</span>
//                   </div>
//                 ` : ''}
//                 <div class="total-row">
//                   <span>Shipping:</span>
//                   <span>Free</span>
//                 </div>
//                 <div class="total-row total-amount">
//                   <span>Total:</span>
//                   <span>₹${order.totalAmount}</span>
//                 </div>
//               </div>
              
//               <div class="shipping-info">
//                 <h4>Shipping Address:</h4>
//                 <p>${order.shippingAddress.fullName}</p>
//                 <p>${order.shippingAddress.addressLine1}</p>
//                 ${order.shippingAddress.addressLine2 ? `<p>${order.shippingAddress.addressLine2}</p>` : ''}
//                 <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}</p>
//                 <p>Phone: ${order.shippingAddress.mobileNo}</p>
//               </div>
              
//               <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
//               <p><strong>Order Status:</strong> ${order.orderStatus}</p>
              
//               <p>We'll send you updates as your order progresses. You can track your order anytime from your account.</p>
              
//               <div class="footer">
//                 <p>Thank you for choosing Quick Plant!</p>
//                 <p>🌱 Greenery Made Simple, Affordable & Hassle-Free!</p>
//               </div>
//             </div>
//           </body>
//         </html>
//       `,
//     };

//     await smtpTransporter.sendMail(mailOptions);
//     return `Order confirmation email sent to ${userEmail}`;
//   } catch (error) {
//     console.error('Order confirmation email error:', error);
//     throw new Error('Failed to send order confirmation email');
//   }
// };

// // Order status update email
// export const sendOrderStatusUpdateEmail = async (order: any, userEmail: string, userName: string, status: string) => {
//   try {
//     if (!SMTP_USER || !SMTP_PASSWORD) {
//       console.error("SMTP credentials not configured");
//       throw new Error("SMTP credentials not configured");
//     }

//     const statusMessages = {
//       confirmed: 'Your order has been confirmed and is being processed.',
//       processing: 'Your order is being prepared for shipment.',
//       shipped: 'Your order has been shipped and is on its way!',
//       delivered: 'Your order has been delivered successfully!'
//     };

//     const mailOptions = {
//       from: `"Quick Plant" <${SMTP_USER}>`,
//       to: userEmail,
//       subject: `Order Update - ${order.orderNumber}`,
//       html: `
//         <html>
//           <head>
//             <style>
//               body { font-family: Arial, sans-serif; background-color: #f2f3f8; padding: 0; margin: 0; }
//               .container { max-width: 700px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
//               .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #28a745; }
//               .logo { color: #28a745; font-size: 24px; font-weight: bold; }
//               .status-update { background: #28a745; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
//               .order-number { background: #f8f9fa; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
//               .footer { text-align: center; margin-top: 20px; color: #666; }
//             </style>
//           </head>
//           <body>
//             <div class="container">
//               <div class="header">
//                 <div class="logo">🌱 Quick Plant</div>
//                 <h2>Order Status Update</h2>
//               </div>
              
//               <p>Hello ${userName},</p>
              
//               <div class="status-update">
//                 <h3>Status: ${status.toUpperCase()}</h3>
//                 <p>${statusMessages[status as keyof typeof statusMessages] || 'Your order status has been updated.'}</p>
//               </div>
              
//               <div class="order-number">
//                 Order Number: ${order.orderNumber}
//               </div>
              
//               ${order.trackingNumber ? `
//                 <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
//               ` : ''}
              
//               ${order.estimatedDelivery ? `
//                 <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
//               ` : ''}
              
//               <p>You can track your order anytime from your account dashboard.</p>
              
//               <div class="footer">
//                 <p>Thank you for choosing Quick Plant!</p>
//                 <p>🌱 Greenery Made Simple, Affordable & Hassle-Free!</p>
//               </div>
//             </div>
//           </body>
//         </html>
//       `,
//     };

//     await smtpTransporter.sendMail(mailOptions);
//     return `Order status update email sent to ${userEmail}`;
//   } catch (error) {
//     console.error('Order status update email error:', error);
//     throw new Error('Failed to send order status update email');
//   }
// }; 