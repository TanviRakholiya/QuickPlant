import { Request, Response } from 'express';
import { Product } from '../database/models/product';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';
import { Order } from '../database/models/order';

// CREATE PRODUCT
export const createProduct = async (req: Request, res: Response) => {
  try {
    const images = Array.isArray(req.body.images)
      ? req.body.images
      : typeof req.body.images === "string"
        ? JSON.parse(req.body.images)
        : [];

    const sizes = typeof req.body.sizes === "string"
      ? JSON.parse(req.body.sizes)
      : req.body.sizes || [];

    const highlights = typeof req.body.highlights === "string"
      ? JSON.parse(req.body.highlights)
      : req.body.highlights || [];

    const features = typeof req.body.features === "string"
      ? JSON.parse(req.body.features)
      : req.body.features || [];

    const product = new Product({
      ...req.body,
      images,
      sizes,
      highlights,
      features,
      uploadedBy: req.user?.id,
      createdBy: req.user?.id,
      updatedBy: req.user?.id,
    });

    await product.save();

    return res.status(201).json(
      new apiResponse(201, "Product created successfully", { data: product }, {})
    );
  } catch (error: any) {
    return res.status(500).json(
      new apiResponse(500, responseMessage.internalServerError, {}, error)
    );
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userType
    } = req.body;

    const query: any = { isDeleted: false };

    if (category) query.category = category;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    let products = await Product.find(query)
      .populate('category', 'name image')
      .populate({
        path: 'uploadedBy',
        select: 'userType'
      })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort(sort);

    if (userType) {
      products = products.filter(
        p =>
          p.uploadedBy &&
          typeof p.uploadedBy === 'object' &&
          'userType' in p.uploadedBy &&
          (p.uploadedBy as any).userType === userType
      );
    }

    const total = await Product.countDocuments(query);

    return res.status(200).json(new apiResponse(200, 'Products fetched successfully', {
      data: {
        products,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total
      }
    }, {}));
  } catch (error: any) {
    console.log(error)
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ _id: req.body.id, isDeleted: false });

    if (!product) {
      return res.status(404).json(new apiResponse(404, 'Product not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Product fetched successfully', { data: product }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const images = Array.isArray(req.body.images)
      ? req.body.images
      : typeof req.body.images === "string"
        ? JSON.parse(req.body.images)
        : undefined;

    const sizes = typeof req.body.sizes === "string"
      ? JSON.parse(req.body.sizes)
      : req.body.sizes;

    const highlights = typeof req.body.highlights === "string"
      ? JSON.parse(req.body.highlights)
      : req.body.highlights;

    const features = typeof req.body.features === "string"
      ? JSON.parse(req.body.features)
      : req.body.features;

    const updateData: any = {
      ...req.body,
      images,
      sizes,
      highlights,
      features,
    };

    if (req.user?.id) {
      updateData.updatedBy = req.user.id;
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.body.id, isDeleted: false },
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json(new apiResponse(404, "Product not found", {}, {}));
    }

    return res.status(200).json(
      new apiResponse(200, "Product updated successfully", { data: product }, {})
    );
  } catch (error: any) {
    return res.status(500).json(
      new apiResponse(500, responseMessage.internalServerError, {}, error)
    );
  }
};


// DELETE PRODUCT (Soft Delete)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.body.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json(new apiResponse(404, 'Product not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Product deleted successfully', { data: product }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// BESTSELLER PRODUCTS
export const bestsellerProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const aggregation: any[] = [
      { $unwind: '$products' },
      { $group: {
        _id: '$products.productId',
        totalSold: { $sum: '$products.quantity' }
      }},
      { $sort: { totalSold: -1 } },
      { $facet: {
        data: [
          { $skip: skip },
          { $limit: Number(limit) },
          { $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails'
          }},
          { $unwind: '$productDetails' },
          { $project: {
            _id: 0,
            productId: '$_id',
            totalSold: 1,
            name: '$productDetails.name',
            price: '$productDetails.price',
            image: { $arrayElemAt: ['$productDetails.images', 0] }
          }}
        ],
        totalCount: [ { $count: 'count' } ]
      }}
    ];
    const result = await Order.aggregate(aggregation);
    const data = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;
    return res.status(200).json(new apiResponse(200, 'Bestseller products fetched successfully', {
      data,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// ADMIN: FEATURE/UNFEATURE PRODUCT
export const adminFeatureProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    if (typeof isFeatured !== 'boolean') {
      return res.status(400).json(new apiResponse(400, 'isFeatured (boolean) is required', {}, {}));
    }
    const product = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isFeatured },
      { new: true }
    );
    if (!product) {
      return res.status(404).json(new apiResponse(404, 'Product not found', {}, {}));
    }
    return res.status(200).json(new apiResponse(200, `Product ${isFeatured ? 'featured' : 'unfeatured'} successfully`, { data: product }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// GET FEATURED PRODUCTS
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const query: any = { isFeatured: true, isDeleted: false };
    const sort: any = { createdAt: -1 };
    const products = await Product.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort(sort);
    const total = await Product.countDocuments(query);
    return res.status(200).json(new apiResponse(200, 'Featured products fetched successfully', {
      data: products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    }, {}));
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

