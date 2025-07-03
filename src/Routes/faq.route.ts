import express from 'express';
import { createFaq, getFaqs, updateFaq, deleteFaq } from '../controllers/faq';
import { authenticate } from '../middleware/authenticate';

const faqRouter = express.Router();

faqRouter.post('/faqs', authenticate, createFaq);
faqRouter.get('/faqs', getFaqs);
faqRouter.put('/faqs/:id', authenticate, updateFaq);
faqRouter.delete('/faqs/:id', authenticate, deleteFaq);

export default faqRouter; 