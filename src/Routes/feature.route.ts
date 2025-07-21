import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  createFeature,
  getFeatures,
  updateFeature,
  deleteFeature
} from '../controllers/feature';
<<<<<<< HEAD
=======
import  upload from '../middleware/uploadImage';
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c
import { validate } from '../middleware/validate';
import { featureValidation } from '../helper/validation';

const featurerouter = express.Router();

featurerouter.get('/', getFeatures);
<<<<<<< HEAD
featurerouter.post('/', authenticate, validate(featureValidation.create),  createFeature);
featurerouter.put('/', authenticate, validate(featureValidation.update),  updateFeature);
=======
featurerouter.post('/', authenticate, validate(featureValidation.create), upload.single('image'), createFeature);
featurerouter.put('/', authenticate, validate(featureValidation.update), upload.single('image'), updateFeature);
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c
featurerouter.delete('/', authenticate, validate(featureValidation.delete), deleteFeature);

export default featurerouter;   