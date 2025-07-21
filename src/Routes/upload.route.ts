import express from "express";
import upload from "../middleware/uploadImage";
<<<<<<< HEAD
import { upload_image, upload_multiple_images } from "../controllers/uploadController";
=======
import { upload_image } from "../controllers/uploadController";
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c

const router = express.Router();

router.post(
  "/image",
  upload.single("image"),
  upload_image
);

export default router;  

router.post(
  "/images",
  upload.array("image", 5), // Accept up to 10 images
  upload_multiple_images
);
