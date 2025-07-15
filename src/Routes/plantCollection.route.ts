import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { UploadPlantImage, getPlantCollection } from '../controllers/plantCollection';

const plantCollectionRouter = express.Router();

plantCollectionRouter.post('/', authenticate,  UploadPlantImage);
plantCollectionRouter.get('/', getPlantCollection);

export default plantCollectionRouter; 