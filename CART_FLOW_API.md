# Quick Plant Cart Flow API Documentation

## Overview

This document describes the complete cart flow system for the Quick Plant e-commerce application. The system includes cart management, address management, order processing, and payment integration.

## Table of Contents

1. [Models](#models)
2. [Cart API](#cart-api)
3. [Address API](#address-api)
4. [Order API](#order-api)
5. [Payment Integration](#payment-integration)
6. [Email Notifications](#email-notifications)

## Models

### Cart Model
```typescript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number,
    selectedSize: {
      label: String,
      price: Number
    },
    isSelected: Boolean
  }],
  appliedCoupon: {
    code: String,
    discount: Number,
    discountType: String
  }
}
```

### Address Model
```typescript
{
  userId: ObjectId,
  fullName: String,
  mobileNo: String,
  email: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,
  country: String,
  isDefault: Boolean,
  addressType: String
}
```

### Order Model
```typescript
{
  userId: ObjectId,
  orderNumber: String,
  products: [{
    productId: ObjectId,
    quantity: Number,
    price: Number,
    originalPrice: Number,
    discountPercent: Number,
    selectedSize: Object
  }],
  subtotal: Number,
  discountAmount: Number,
  couponDiscount: Number,
  platformFee: Number,
  shippingFee: Number,
  totalAmount: Number,
  shippingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  transactionId: String,
  trackingNumber: String,
  estimatedDelivery: Date
}
```

### Coupon Model
```typescript
{
  code: String,
  name: String,
  description: String,
  discountType: String,
  discountValue: Number,
  minimumOrderAmount: Number,
  maximumDiscount: Number,
  validFrom: Date,
  validUntil: Date,
  usageLimit: Number,
  usedCount: Number,
  isActive: Boolean
}
```

## Cart API

### Base URL: `/api/cart`

#### 1. Add Item to Cart
- **POST** `/add`
- **Authentication**: Required
- **Body**:
```json
{
  "productId": "product_id_here",
  "quantity": 1,
  "selectedSize": {
    "label": "Medium",
    "price": 299
  }
}
```

#### 2. Get Cart
- **GET** `/`
- **Authentication**: Required
- **Response**:
```json
{
  "status": 200,
  "message": "Cart retrieved successfully",
  "data": {
    "items": [...],
    "appliedCoupon": {...},
    "summary": {
      "subtotal": 897,
      "discountAmount": 0,
      "couponDiscount": 0,
      "platformFee": 0,
      "shippingFee": 0,
      "totalAmount": 897,
      "totalItems": 3,
      "selectedItems": 3
    }
  }
}
```

#### 3. Update Cart Item
- **PUT** `/update`
- **Authentication**: Required
- **Body**:
```json
{
  "productId": "product_id_here",
  "quantity": 2,
  "selectedSize": {...},
  "isSelected": true
}
```

#### 4. Remove Item from Cart
- **DELETE** `/remove/:productId`
- **Authentication**: Required

#### 5. Clear Cart
- **DELETE** `/clear`
- **Authentication**: Required

#### 6. Apply Coupon
- **POST** `/apply-coupon`
- **Authentication**: Required
- **Body**:
```json
{
  "couponCode": "SAVE20"
}
```

#### 7. Remove Coupon
- **DELETE** `/remove-coupon`
- **Authentication**: Required

#### 8. Get Checkout Details
- **GET** `/checkout`
- **Authentication**: Required
- **Response**:
```json
{
  "cart": {...},
  "addresses": [...],
  "paymentMethods": [
    {
      "id": "cod",
      "name": "Cash on Delivery",
      "description": "Pay when you receive"
    }
  ]
}
```

#### 9. Place Order
- **POST** `/place-order`
- **Authentication**: Required
- **Body**:
```json
{
  "shippingAddressId": "address_id_here",
  "paymentMethod": "cod",
  "selectedItems": ["product_id_1", "product_id_2"]
}
```

## Address API

### Base URL: `/api/address`

#### 1. Create Address
- **POST** `/`
- **Authentication**: Required
- **Body**:
```json
{
  "fullName": "John Doe",
  "mobileNo": "9876543210",
  "email": "john@example.com",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "isDefault": false,
  "addressType": "home"
}
```

#### 2. Get All Addresses
- **GET** `/`
- **Authentication**: Required

#### 3. Get Address by ID
- **GET** `/:addressId`
- **Authentication**: Required

#### 4. Update Address
- **PUT** `/:addressId`
- **Authentication**: Required

#### 5. Delete Address
- **DELETE** `/:addressId`
- **Authentication**: Required

#### 6. Set Default Address
- **PATCH** `/:addressId/default`
- **Authentication**: Required

## Order API

### Base URL: `/api/orders`

#### 1. Get User Orders
- **GET** `/my-orders`
- **Authentication**: Required
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `status`: Filter by order status

#### 2. Get Order Summary
- **GET** `/summary`
- **Authentication**: Required

#### 3. Get Order by ID
- **GET** `/:orderId`
- **Authentication**: Required

#### 4. Cancel Order
- **POST** `/:orderId/cancel`
- **Authentication**: Required

#### 5. Track Order
- **GET** `/:orderId/track`
- **Authentication**: Required
- **Response**:
```json
{
  "orderNumber": "QP24120001",
  "orderStatus": "shipped",
  "trackingNumber": "TRK123456789",
  "estimatedDelivery": "2024-12-25T00:00:00.000Z",
  "timeline": [
    {
      "status": "pending",
      "label": "Order Placed",
      "description": "Your order has been placed successfully",
      "isCompleted": true,
      "isCurrent": false
    }
  ]
}
```

### Admin Order API

#### 1. Get All Orders (Admin)
- **GET** `/admin/all`
- **Authentication**: Required
- **Role**: SELLER, GARDENER
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `status`: Filter by order status
  - `search`: Search by order number, customer name, or phone

#### 2. Update Order Status (Admin)
- **PUT** `/admin/:orderId/status`
- **Authentication**: Required
- **Role**: SELLER, GARDENER
- **Body**:
```json
{
  "orderStatus": "shipped",
  "trackingNumber": "TRK123456789",
  "estimatedDelivery": "2024-12-25T00:00:00.000Z"
}
```

## Payment Integration

### Payment Methods
- **COD**: Cash on Delivery
- **Online**: Online payment gateway
- **UPI**: UPI payment
- **Card**: Credit/Debit card

### Payment Processing
The system includes a mock payment service that can be replaced with actual payment gateway integrations:

- Razorpay
- Stripe
- PayPal
- Other payment gateways

### Payment Flow
1. User selects payment method during checkout
2. System processes payment through selected gateway
3. Payment status is updated in order
4. Order confirmation email is sent

## Email Notifications

### Order Confirmation Email
- Sent when order is placed successfully
- Includes order details, products, pricing, and shipping information

### Order Status Update Email
- Sent when order status changes
- Includes new status, tracking information, and estimated delivery

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "status": 400,
  "message": "Error message",
  "data": {},
  "error": {}
}
```

## Authentication

All cart, address, and order endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Validation

All input data is validated using Joi schemas:

- Product IDs must be valid MongoDB ObjectIds
- Quantities must be positive integers
- Address fields have specific format requirements
- Payment methods must be from allowed list

## Environment Variables

Required environment variables for the cart flow:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment Gateway (optional)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret
```

## Usage Examples

### Complete Cart Flow

1. **Add items to cart**:
```bash
POST /api/cart/add
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

2. **Apply coupon**:
```bash
POST /api/cart/apply-coupon
{
  "couponCode": "SAVE20"
}
```

3. **Create shipping address**:
```bash
POST /api/address
{
  "fullName": "John Doe",
  "mobileNo": "9876543210",
  "email": "john@example.com",
  "addressLine1": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

4. **Place order**:
```bash
POST /api/cart/place-order
{
  "shippingAddressId": "507f1f77bcf86cd799439012",
  "paymentMethod": "cod"
}
```

5. **Track order**:
```bash
GET /api/orders/507f1f77bcf86cd799439013/track
```

This cart flow system provides a complete e-commerce solution with all necessary features for managing shopping carts, addresses, orders, and payments. 