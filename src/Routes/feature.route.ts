import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  createFeature,
  getFeatures,
  updateFeature,
  deleteFeature
} from '../controllers/feature';
import { featureIconUpload } from '../middleware/uploadFile';
import { validate } from '../middleware/validate';
import { featureValidation } from '../helper/validation';

const featurerouter = express.Router();

featurerouter.get('/', getFeatures);
featurerouter.post('/', authenticate, validate(featureValidation.create), featureIconUpload.single('image'), createFeature);
featurerouter.put('/', authenticate, validate(featureValidation.update), featureIconUpload.single('image'), updateFeature);
featurerouter.delete('/', authenticate, validate(featureValidation.delete), deleteFeature);

export default featurerouter;   