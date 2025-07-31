import { Request, Response } from 'express';
import { Cart, Product, Coupon, Address, Order } from '../database/models';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';
import mongoose from 'mongoose';

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1, selectedSize } = req.body;
    const userId = req.user?.id;

    if (!productId) {
      return res.status(400).json(new apiResponse(400, 'Product ID is required', {}, {}));
    }

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product || product.isDeleted) {
      return res.status(404).json(new apiResponse(404, 'Product not found', {}, {}));
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        createdBy: userId,
        updatedBy: userId
      });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity and size
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].selectedSize = selectedSize;
    } else {
      // Safely push new item into subdocument array
      cart.items.push(
        cart.items.create({
          productId,
          quantity,
          selectedSize
        })
      );
    }

    cart.updatedBy = userId;
    await cart.save();

    // Populate product details
    await cart.populate({path:'items.productId',select:'name description images price originalPrice discountPercent'});

    return res.status(200).json(new apiResponse(200, 'Item added to cart successfully', { cart }, {}));
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};


// Get cart with details
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'name description images price originalPrice discountPercent'
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json(new apiResponse(200, 'Cart is empty', { cart: { items: []} }, {}));
    }

    const cartResponse = {
      items: cart.items,
    };

    return res.status(200).json(new apiResponse(200, 'Cart retrieved successfully', cartResponse, {}));
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Update cart item
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, selectedSize } = req.body;
    const userId = req.user?.id;

    if (!productId) {
      return res.status(400).json(new apiResponse(400, 'Product ID is required', {}, {}));
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json(new apiResponse(404, 'Cart not found', {}, {}));
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json(new apiResponse(404, 'Item not found in cart', {}, {}));
    }

    // Update item
    if (quantity !== undefined) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    if (selectedSize !== undefined) {
      cart.items[itemIndex].selectedSize = selectedSize;
    }

   
    cart.updatedBy = userId;
    await cart.save();

    return res.status(200).json(new apiResponse(200, 'Cart item updated successfully', { cart }, {}));
  } catch (error) {
    console.error('Update cart item error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};
    
// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json(new apiResponse(404, 'Cart not found', {}, {}));
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json(new apiResponse(404, 'Item not found in cart', {}, {}));
    }

    cart.items.splice(itemIndex, 1);
    cart.updatedBy = userId;
    await cart.save();

    return res.status(200).json(new apiResponse(200, 'Item removed from cart successfully', { cart }, {}));
  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Clear cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json(new apiResponse(404, 'Cart not found', {}, {}));
    }

    cart.set('items',[]);
    // cart.appliedCoupon = null;
    cart.updatedBy = userId;
    await cart.save();

    return res.status(200).json(new apiResponse(200, 'Cart cleared successfully', { cart }, {}));
  } catch (error) {
    console.error('Clear cart error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

