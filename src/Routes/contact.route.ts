import express from 'express';
import { createContact,getAllContacts } from '../controllers/contact';
import { authenticate } from '../middleware/authenticate';

const contactRouter = express.Router();

contactRouter.post('/',authenticate, createContact);
contactRouter.get('/',authenticate,getAllContacts );

export default contactRouter;