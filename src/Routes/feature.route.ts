import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  createFeature,
  getFeatures,
  updateFeature,
  deleteFeature
} from '../controllers/feature';
import  upload from '../middleware/uploadImage';
import { validate } from '../middleware/validate';
import { featureValidation } from '../helper/validation';

const featurerouter = express.Router();

featurerouter.get('/', getFeatures);
featurerouter.post('/', authenticate, validate(featureValidation.create), upload.single('image'), createFeature);
featurerouter.put('/', authenticate, validate(featureValidation.update), upload.single('image'), updateFeature);
featurerouter.delete('/', authenticate, validate(featureValidation.delete), deleteFeature);

export default featurerouter;   