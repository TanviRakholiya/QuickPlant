"use strict"
/**
 * @author Arpit Nakarani
 * @description Server and REST API config
 */
import express, { Request, Response, Application } from 'express';

import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { router } from './Routes';
import { mongooseConnection } from './database/connection';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

    
// app.use('/uploads/image/auth', express.static(path.join(__dirname, 'Public/Image/auth')));
// app.use('/uploads/image/plant-category', express.static(path.join(__dirname, 'Public/Image/plant-category')));
// app.use('/uploads/image/product', express.static(path.join(__dirname, 'Public/Image/product')));
// app.use('/uploads/image/service', express.static(path.join(__dirname, 'Public/Image/service')));
// app.use('/uploads/image/feature-icon', express.static(path.join(__dirname, 'Public/Image/feature-icon')));
app.use('/Image/uploads', express.static(path.join(__dirname, 'Public/Image/uploads')));

// Initialize server setup
const init = async () => {
    await mongooseConnection(); // Ensure DB is connected before continuing

    app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


    app.use(cors());
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));

    app.use('/api', router);
    // app.use('*', bad_gateway);
};

init(); // Start initialization

// Export server instance
const server = http.createServer(app);
export default server;