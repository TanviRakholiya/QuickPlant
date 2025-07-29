import { Request, Response } from 'express';
import { Order, Product } from '../database/models';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';
import mongoose from 'mongoose';

// Get user orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = { userId };

    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('products.productId', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    return res.status(200).json(new apiResponse(200, 'Orders retrieved successfully', {
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalOrders: total,
        hasNextPage: skip + orders.length < total,
        hasPrevPage: Number(page) > 1
      }
    }, {}));
  } catch (error) {
    console.error('Get user orders error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await Order.findOne({ _id: orderId, userId })
      .populate('products.productId', 'name description images price originalPrice discountPercent');

    if (!order) {
      return res.status(404).json(new apiResponse(404, 'Order not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Order retrieved successfully', { order }, {}));
  } catch (error) {
    console.error('Get order by ID error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json(new apiResponse(404, 'Order not found', {}, {}));
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json(new apiResponse(400, 'Order cannot be cancelled at this stage', {}, {}));
    }

    order.orderStatus = 'cancelled';
    order.updatedBy = userId;
    await order.save();

    return res.status(200).json(new apiResponse(200, 'Order cancelled successfully', { order }, {}));
  } catch (error) {
    console.error('Cancel order error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Track order
export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await Order.findOne({ _id: orderId, userId })
      .populate('products.productId', 'name images');

    if (!order) {
      return res.status(404).json(new apiResponse(404, 'Order not found', {}, {}));
    }

    // Define order status timeline
    const statusTimeline = [
      { status: 'pending', label: 'Order Placed', description: 'Your order has been placed successfully' },
      { status: 'confirmed', label: 'Order Confirmed', description: 'Your order has been confirmed' },
      { status: 'processing', label: 'Processing', description: 'Your order is being processed' },
      { status: 'shipped', label: 'Shipped', description: 'Your order has been shipped' },
      { status: 'delivered', label: 'Delivered', description: 'Your order has been delivered' }
    ];

    const currentStatusIndex = statusTimeline.findIndex(item => item.status === order.orderStatus);
    const timeline = statusTimeline.map((item, index) => ({
      ...item,
      isCompleted: index <= currentStatusIndex,
      isCurrent: index === currentStatusIndex
    }));

    const trackingInfo = {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      timeline,
      shippingAddress: order.shippingAddress
    };

    return res.status(200).json(new apiResponse(200, 'Order tracking retrieved successfully', trackingInfo, {}));
  } catch (error) {
    console.error('Track order error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Get order summary
export const getOrderSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const orderStats = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments({ userId });
    const recentOrders = await Order.find({ userId })
      .populate('products.productId', 'name images')
      .sort({ createdAt: -1 })
      .limit(5);

    const summary = {
      totalOrders,
      orderStats: orderStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      recentOrders
    };

    return res.status(200).json(new apiResponse(200, 'Order summary retrieved successfully', summary, {}));
  } catch (error) {
    console.error('Get order summary error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Admin: Get all orders (for admin panel)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    if (status) {
      filter.orderStatus = status;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.mobileNo': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .populate('userId', 'fullName email mobileNo')
      .populate('products.productId', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    return res.status(200).json(new apiResponse(200, 'Orders retrieved successfully', {
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalOrders: total
      }
    }, {}));
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(new apiResponse(404, 'Order not found', {}, {}));
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    await order.save();

    return res.status(200).json(new apiResponse(200, 'Order status updated successfully', { order }, {}));
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
}; 