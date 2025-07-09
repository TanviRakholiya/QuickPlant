import express from 'express';
import { createFaq, getFaqs, updateFaq, deleteFaq } from '../controllers/faq';
import { authenticate } from '../middleware/authenticate';

const faqRouter = express.Router();

faqRouter.post('/', authenticate, createFaq);
faqRouter.get('/', getFaqs);
faqRouter.put('/faqs/:id', authenticate, updateFaq);
faqRouter.delete('/faqs/:id', authenticate, deleteFaq);

export default faqRouter; 