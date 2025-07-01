import express from 'express';
import {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deactivatePlan,
  deletePlan
} from '../controllers/plan';
import { deleteFeature } from '../controllers';

const planRouter = express.Router();

planRouter.get('/', getAllPlans);
planRouter.get('/:id', getPlanById);
planRouter.post('/', createPlan);
planRouter.put('/:id', updatePlan);
planRouter.patch('/:id/deactivate', deactivatePlan);
planRouter.delete('/:id',deletePlan)
  
export default planRouter; 