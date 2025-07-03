import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deactivatePlan,
  deletePlan
} from '../controllers/plan';
import { deleteFeature } from '../controllers';
import { validate } from '../middleware/validate';
import { planValidation } from '../helper/validation';

const planRouter = express.Router();

planRouter.get('/', getAllPlans);
planRouter.get('/:id', getPlanById);
planRouter.post('/', authenticate, validate(planValidation.create), createPlan);
planRouter.put('/:id', authenticate, validate(planValidation.update), updatePlan);
planRouter.patch('/:id/deactivate', deactivatePlan);
planRouter.delete('/:id', authenticate, validate(planValidation.delete), deletePlan)
  
export default planRouter; 