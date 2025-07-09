import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { UploadPlantImage, getPlantCollection } from '../controllers/plantCollection';
import { plantCollectionUpload } from '../middleware/uploadFile';

const plantCollectionRouter = express.Router();

plantCollectionRouter.post('/', authenticate, plantCollectionUpload.single('image'), UploadPlantImage);
plantCollectionRouter.get('/', getPlantCollection);

export default plantCollectionRouter; 