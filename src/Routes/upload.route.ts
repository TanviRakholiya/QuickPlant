import express from "express";
import upload from "../middleware/uploadImage";
import { upload_image, upload_multiple_images } from "../controllers/uploadController";

const router = express.Router();

router.post(
  "/image",
  upload.single("image"),
  upload_image
);

export default router;  

router.post(
  "/images",
  upload.array("image",10), // Accept up to 10 images
  upload_multiple_images
);
