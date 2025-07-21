import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { UploadPlantImage, getPlantCollection } from '../controllers/plantCollection';
<<<<<<< HEAD

const plantCollectionRouter = express.Router();

plantCollectionRouter.post('/', authenticate,  UploadPlantImage);
=======
import upload from '../middleware/uploadImage';

const plantCollectionRouter = express.Router();

plantCollectionRouter.post('/', authenticate, upload.single('image'), UploadPlantImage);
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c
plantCollectionRouter.get('/', getPlantCollection);

export default plantCollectionRouter; 