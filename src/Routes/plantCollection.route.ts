import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { UploadPlantImage, getPlantCollection } from '../controllers/plantCollection';
import upload from '../middleware/uploadImage';

const plantCollectionRouter = express.Router();

plantCollectionRouter.post('/', authenticate, upload.single('image'), UploadPlantImage);
plantCollectionRouter.get('/', getPlantCollection);

export default plantCollectionRouter; 