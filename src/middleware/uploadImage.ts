import multer from "multer";
import fs from "fs";
import path from "path";

// Base folder: /Public/Image/
const baseUploadDir = path.join(__dirname, "../Public/Image");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subfolder = req.query.subfolder as string;

    const allowedSubfolders = [
      "auth",
      "product",
      "plant-category",
      "service",
      "feature-icon",
      "review",
      "plant-collection",
      "blog"
    ];

    if (!subfolder || !allowedSubfolders.includes(subfolder)) {
      return cb(new Error("Invalid or missing subfolder"), "");
    }

    const finalPath = path.join(baseUploadDir, subfolder);
    fs.mkdirSync(finalPath, { recursive: true });
    cb(null, finalPath);
  }, 
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});


const upload = multer({ storage });

export default upload;
