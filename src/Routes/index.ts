import {  Router } from 'express';
import authrouter from './auth.route';
import categoryRouter from './category.route';
import featurerouter from './feature.route';
// import productRouter from './product.route';
import planRouter from './plan.route';
import serviceRouter from './service.route';
import reviewRouter from './review.route';
import plantCollectionRouter from './plantCollection.route';
import faqRouter from './faq.route';
import blogRouter from './blog.route';
import uploadRoutes from "./upload.route";
import contactRouter from './contact.route';
import cartRouter from './cart.route';
import addressRouter from './address.route';
import orderRouter from './order.route';

const router = Router();

router.use('/auth', authrouter);
router.use('/category', categoryRouter);
router.use('/feature',featurerouter);
// router.use('/product',productRouter);
router.use('/plans', planRouter);
router.use('/services', serviceRouter);
router.use('/reviews', reviewRouter);
router.use('/plantcollection', plantCollectionRouter);
router.use('/faq', faqRouter);
router.use('/blog',blogRouter)
router.use("/upload", uploadRoutes);
router.use('/contact',contactRouter);
router.use('/cart', cartRouter);
router.use('/address', addressRouter);
router.use('/orders', orderRouter);

export { router };
