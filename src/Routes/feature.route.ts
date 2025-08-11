import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  createFeature,
  getFeatures,
  updateFeature,
  deleteFeature
} from '../controllers/feature';
import { validate } from '../middleware/validate';
import { featureValidation } from '../helper/validation';

const featurerouter = express.Router();

featurerouter.get('/all', getFeatures);
featurerouter.post('/', authenticate, validate(featureValidation.create),  createFeature);
featurerouter.put('/', authenticate, validate(featureValidation.update),  updateFeature);
featurerouter.delete('/', authenticate, validate(featureValidation.delete), deleteFeature);

export default featurerouter;   