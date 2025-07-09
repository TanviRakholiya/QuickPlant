import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import * as Express from 'express'

// Resolve path to: src/Public/Image
const imageDir = path.join(__dirname, '../Public/Image');

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    cb(null, imageDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, png and jpeg formats allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;

// Helper to create storage for a subfolder
function makeStorage(subfolder: string, prefix: string) {
  const dir = path.join(__dirname, `../Public/Image/${subfolder}`);
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${prefix}_${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });
}

// For user profile images (auth)
export const authUpload = multer({ storage: makeStorage('auth', 'auth') });
// For plant-category images
export const categoryUpload = multer({ storage: makeStorage('plant-category', 'category') });
// For product images
export const productUpload = multer({ storage: makeStorage('product', 'product') });
// For service images
export const serviceUpload = multer({ storage: makeStorage('service', 'service') });
// For feature icon images
export const featureIconUpload = multer({ storage: makeStorage('feature-icon', 'featureicon') });

// For review photos
export const reviewUpload = multer({ storage: makeStorage('review', 'review') });
// For plant-collection images
export const plantCollectionUpload = multer({ storage: makeStorage('plant-collection', 'plantcollection') });




