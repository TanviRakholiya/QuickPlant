import express from "express";
import uploadImage from "../middleware/uploadImage";
import { upload_image } from "../controllers/uploadController";

const router = express.Router();

router.post(
  "/image",
  uploadImage.single("image"),
  upload_image
);

export default router; 