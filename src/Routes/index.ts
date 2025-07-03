import {  Router } from 'express';
import authrouter from './auth.route';
import categoryRouter from './category.route';
import featurerouter from './feature.route';
import productRouter from './product.route';
import planRouter from './plan.route';
import serviceRouter from './service.route';
import reviewRouter from './review.route';
import plantCollectionRouter from './plantCollection.route';
import faqRouter from './faq.route';

const router = Router();

router.use('/auth', authrouter);
router.use('/category', categoryRouter);
router.use('/feature',featurerouter);
router.use('/product',productRouter);
router.use('/plans', planRouter);
router.use('/services', serviceRouter);
router.use('/reviews', reviewRouter);
router.use('/plantcollection', plantCollectionRouter);
router.use('/faq', faqRouter);

export { router };
