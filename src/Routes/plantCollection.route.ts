import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { adminUploadPlantImage, getPlantCollection } from '../controllers/plantCollection';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../Public/Image/plant-collection'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const plantCollectionRouter = express.Router();

plantCollectionRouter.post('/admin/plant-collection', authenticate, upload.single('image'), adminUploadPlantImage);
plantCollectionRouter.get('/plant-collection', getPlantCollection);

export default plantCollectionRouter; 