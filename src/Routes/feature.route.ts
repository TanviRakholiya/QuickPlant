import express from 'express';
import {
  createFeature,
  getFeatures,
  updateFeature,
  deleteFeature
} from '../controllers/feature';
import { featureIconUpload } from '../middleware/uploadFile';

const featurerouter = express.Router();

featurerouter.post('/', featureIconUpload.single('image'), createFeature);
featurerouter.get('/', getFeatures);
featurerouter.put('/', featureIconUpload.single('image'), updateFeature);
featurerouter.delete('/', deleteFeature);

export default featurerouter;   