import { Request, Response } from 'express';
import { blogModel } from '../database/models/blog';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';

// CREATE BLOG
export const createBlog = async (req: Request, res: Response) => {
  try {
    const image = typeof req.body.image === "string" ? req.body.image : "";

    const blog = new blogModel({
      ...req.body,
      image,
      createdBy: req.user?.id,
      updatedBy: req.user?.id
    });

    await blog.save();

    return res
      .status(201)
      .json(new apiResponse(201, "Blog created successfully", { data: blog }, {}));
  } catch (error: any) {
    return res
      .status(500)
      .json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};


// GET ALL BLOGS (See All Blogs Page)
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      search = '',
      author = '',
      sortBy = 'publishedDate',
      sortOrder = 'desc'
    } = req.body;

    const currentPage = parseInt(page as string);
    const pageSize = parseInt(limit as string);

    const query: any = { isDeleted: false };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const blogs = await blogModel.find(query)
      .sort(sort)
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    const total = await blogModel.countDocuments(query);

    return res.status(200).json(new apiResponse(200, 'Blogs fetched successfully', {
      data: blogs,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
      total
    }, {}));
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// GET FEATURED + RECENT BLOGS FOR HOMEPAGE SECTION
export const getHomeBlogSection = async (req: Request, res: Response) => {
  try {
    const featured = await blogModel.findOne({ isFeatured: true, isDeleted: false })
      .sort({ createdAt: -1 })
      .lean();

    const recent = await blogModel.find({ isDeleted: false, isFeatured: false })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();

    return res.status(200).json(new apiResponse(200, 'Home blog section fetched', {
      featured,
      recent
    }, {}));
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// DELETE BLOG (Soft Delete)
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await blogModel.findOneAndUpdate(
      { _id: req.body.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json(new apiResponse(404, 'Blog not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Blog deleted successfully', { data: blog }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};
