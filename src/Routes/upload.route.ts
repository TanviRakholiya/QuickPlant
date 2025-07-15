import express from "express";
import upload from "../middleware/uploadImage";
import { upload_image } from "../controllers/uploadController";

const router = express.Router();

router.post(
  "/image",
  upload.single("image"),
  upload_image
);

export default router; 