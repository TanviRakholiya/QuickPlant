import {  Router } from 'express';
import authrouter from './auth.route';
import categoryRouter from './category.route';
import featurerouter from './feature.route';
import productRouter from './product.route';
import planRouter from './plan.route';
import serviceRouter from './service.route';

const router = Router();

router.use('/auth', authrouter);
router.use('/category', categoryRouter);
router.use('/feature',featurerouter);
router.use('/product',productRouter);
router.use('/plans', planRouter);
router.use('/services', serviceRouter);

export { router };
