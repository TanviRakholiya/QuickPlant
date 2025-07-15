import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { UploadPlantImage, getPlantCollection } from '../controllers/plantCollection';
import uploadImage from '../middleware/uploadImage';

const plantCollectionRouter = express.Router();

plantCollectionRouter.post('/', authenticate, uploadImage.single('image'), UploadPlantImage);
plantCollectionRouter.get('/', getPlantCollection);

export default plantCollectionRouter; 