# Quick Plant Cart Flow API - UI Implementation

## Overview

This document describes the complete cart flow API implementation that matches the exact UI design shown in the cart and address selection screens. The system implements a 3-step checkout process: **My Cart** → **Select Address** → **Payment Process**.

## 3-Step Checkout Flow

### Step 1: My Cart
**UI Elements:**
- Header with progress indicator (My Cart highlighted)
- Cart items with checkboxes for selection
- Quantity selectors with +/- buttons
- Price details with MRP, discounts, and total
- Coupon application section
- "Place Order" button

### Step 2: Select Address
**UI Elements:**
- Header with progress indicator (Select Address highlighted)
- Default address card with radio button selection
- "Add New Address" button
- Payment method icons (VISA, Mastercard, BHIM, etc.)
- Same price details sidebar
- "Place Order" button

### Step 3: Payment Process
**UI Elements:**
- Header with progress indicator (Payment Process highlighted)
- Payment method selection
- Order confirmation
- Payment processing

## API Endpoints

### Base URLs
- Cart Operations: `/api/cart`
- Address Management: `/api/address`
- Order Management: `/api/orders`
- Checkout Flow: `/api/checkout`

---

## Step 1: Cart Management

### 1.1 Get Cart (Step 1 UI)
**GET** `/api/checkout/cart`

**Response:**
```json
{
  "status": 200,
  "message": "Cart step retrieved successfully",
  "data": {
    "step": "cart",
    "cart": {
      "items": [
        {
          "_id": "item_id",
          "productId": {
            "_id": "product_id",
            "name": "Peace Lily Plant",
            "description": "The Peace Lily plant is a stunning indoor flowering plant with dark.",
            "images": ["image_url"],
            "price": 299,
            "originalPrice": 399,
            "discountPercent": 25
          },
          "quantity": 1,
          "isSelected": true,
          "selectedSize": {
            "label": "Medium",
            "price": 299
          }
        }
      ],
      "appliedCoupon": null,
      "summary": {
        "totalMRP": 7497,
        "discountOnMRP": 5136,
        "couponDiscount": 0,
        "platformFee": 0,
        "shippingFee": 0,
        "totalAmount": 2361,
        "totalItems": 3,
        "selectedItems": 3
      }
    },
    "checkoutFlow": {
      "currentStep": "cart",
      "steps": [
        { "id": "cart", "name": "My Cart", "status": "current" },
        { "id": "address", "name": "Select Address", "status": "pending" },
        { "id": "payment", "name": "Payment Process", "status": "pending" }
      ]
    }
  }
}
```

### 1.2 Add Item to Cart
**POST** `/api/cart/add`

**Body:**
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

### 1.3 Update Cart Item
**PUT** `/api/cart/update`

**Body:**
```json
{
  "productId": "product_id_here",
  "quantity": 2,
  "isSelected": true
}
```

### 1.4 Toggle Item Selection (Checkbox)
**POST** `/api/cart/toggle-selection`

**Body:**
```json
{
  "productId": "product_id_here"
}
```

### 1.5 Select All Items
**POST** `/api/cart/select-all`

### 1.6 Apply Coupon
**POST** `/api/cart/apply-coupon`

**Body:**
```json
{
  "couponCode": "SAVE20"
}
```

### 1.7 Remove Item from Cart
**DELETE** `/api/cart/remove/:productId`

---

## Step 2: Address Selection

### 2.1 Get Address Step (Step 2 UI)
**GET** `/api/checkout/address`

**Response:**
```json
{
  "status": 200,
  "message": "Address step retrieved successfully",
  "data": {
    "step": "address",
    "cart": {
      "items": [...],
      "summary": {
        "totalMRP": 7497,
        "discountOnMRP": 5136,
        "couponDiscount": 0,
        "platformFee": 0,
        "shippingFee": 0,
        "totalAmount": 2361
      }
    },
    "addresses": [
      {
        "_id": "address_id",
        "fullName": "Your Name",
        "mobileNo": "0123456789",
        "email": "email@example.com",
        "addressLine1": "301, Ambika Pinnacle, Lajamni chowk, Mota Varachha, Surat.",
        "city": "Surat",
        "state": "Gujarat",
        "pincode": "395006",
        "isDefault": true,
        "addressType": "home"
      }
    ],
    "paymentMethods": [
      {
        "id": "cod",
        "name": "Cash on Delivery",
        "description": "Pay when you receive",
        "icon": "💵"
      },
      {
        "id": "online",
        "name": "Online Payment",
        "description": "Pay securely with card/UPI",
        "icon": "💳"
      }
    ],
    "checkoutFlow": {
      "currentStep": "address",
      "steps": [
        { "id": "cart", "name": "My Cart", "status": "completed" },
        { "id": "address", "name": "Select Address", "status": "current" },
        { "id": "payment", "name": "Payment Process", "status": "pending" }
      ]
    }
  }
}
```

### 2.2 Create New Address
**POST** `/api/address`

**Body:**
```json
{
  "fullName": "Your Name",
  "mobileNo": "0123456789",
  "email": "email@example.com",
  "addressLine1": "301, Ambika Pinnacle, Lajamni chowk, Mota Varachha, Surat.",
  "city": "Surat",
  "state": "Gujarat",
  "pincode": "395006",
  "isDefault": true,
  "addressType": "home"
}
```

### 2.3 Get All Addresses
**GET** `/api/address`

### 2.4 Update Address
**PUT** `/api/address/:addressId`

### 2.5 Set Default Address
**PATCH** `/api/address/:addressId/default`

---

## Step 3: Payment Process

### 3.1 Process Payment (Step 3 UI)
**POST** `/api/checkout/payment`

**Body:**
```json
{
  "shippingAddressId": "address_id_here",
  "paymentMethod": "cod",
  "selectedItems": ["product_id_1", "product_id_2"]
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Order placed successfully",
  "data": {
    "step": "payment",
    "order": {
      "orderNumber": "QP24120001",
      "totalAmount": 2361,
      "paymentStatus": "pending",
      "transactionId": "TXN_123456789"
    },
    "checkoutFlow": {
      "currentStep": "payment",
      "steps": [
        { "id": "cart", "name": "My Cart", "status": "completed" },
        { "id": "address", "name": "Select Address", "status": "completed" },
        { "id": "payment", "name": "Payment Process", "status": "completed" }
      ]
    }
  }
}
```

---

## Cart Operations (Legacy Endpoints)

### Get Cart
**GET** `/api/cart`

### Clear Cart
**DELETE** `/api/cart/clear`

### Remove Coupon
**DELETE** `/api/cart/remove-coupon`

---

## Order Management

### Get User Orders
**GET** `/api/orders/my-orders`

### Get Order by ID
**GET** `/api/orders/:orderId`

### Track Order
**GET** `/api/orders/:orderId/track`

**Response:**
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
    },
    {
      "status": "confirmed",
      "label": "Order Confirmed",
      "description": "Your order has been confirmed",
      "isCompleted": true,
      "isCurrent": false
    },
    {
      "status": "shipped",
      "label": "Shipped",
      "description": "Your order has been shipped",
      "isCompleted": true,
      "isCurrent": true
    }
  ]
}
```

### Cancel Order
**POST** `/api/orders/:orderId/cancel`

---

## UI-Specific Features

### Price Calculation Structure
The API returns pricing in the exact format shown in the UI:

```json
{
  "summary": {
    "totalMRP": 7497,        // Total MRP (original prices)
    "discountOnMRP": 5136,   // Discount on MRP
    "couponDiscount": 0,     // Additional coupon discount
    "platformFee": 0,        // Free (as shown in UI)
    "shippingFee": 0,        // Free (as shown in UI)
    "totalAmount": 2361      // Final amount
  }
}
```

### Item Selection
- Each cart item has an `isSelected` boolean field
- Items can be individually selected/deselected
- "Select All" functionality available
- Only selected items are included in checkout

### Checkout Flow Progress
The API tracks the 3-step checkout process:
1. **cart** - Current step
2. **address** - Address selection
3. **payment** - Payment processing

Each step returns the current progress status.

### Payment Methods
Available payment methods match the UI:
- **cod** - Cash on Delivery
- **online** - Online Payment
- **upi** - UPI Payment
- **card** - Credit/Debit Card

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "status": 400,
  "message": "Error message",
  "data": {},
  "error": {}
}
```

## Authentication

All endpoints require authentication. Include JWT token:

```
Authorization: Bearer <jwt_token>
```

## Usage Examples

### Complete Checkout Flow

1. **Get Cart Step:**
```bash
GET /api/checkout/cart
```

2. **Add Items and Apply Coupon:**
```bash
POST /api/cart/add
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}

POST /api/cart/apply-coupon
{
  "couponCode": "SAVE20"
}
```

3. **Get Address Step:**
```bash
GET /api/checkout/address
```

4. **Create Address (if needed):**
```bash
POST /api/address
{
  "fullName": "Your Name",
  "mobileNo": "0123456789",
  "email": "email@example.com",
  "addressLine1": "301, Ambika Pinnacle, Lajamni chowk, Mota Varachha, Surat.",
  "city": "Surat",
  "state": "Gujarat",
  "pincode": "395006"
}
```

5. **Process Payment:**
```bash
POST /api/checkout/payment
{
  "shippingAddressId": "507f1f77bcf86cd799439012",
  "paymentMethod": "cod"
}
```

6. **Track Order:**
```bash
GET /api/orders/507f1f77bcf86cd799439013/track
```

This API implementation perfectly matches the UI design shown in the cart and address selection screens, providing a seamless 3-step checkout experience. 