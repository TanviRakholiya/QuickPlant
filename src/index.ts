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
import multer from "multer";
import { apiResponse } from './common';

dotenv.config();

const app: Application = express();

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

    app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json(
        new apiResponse(400, "Only one image is allowed.", {}, {})
      );
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json(
        new apiResponse(400, "Too many files uploaded. Maximum is 5.", {}, err)
      );
    }

    return res.status(400).json(
      new apiResponse(400, "Multer error: " + err.message, {}, err)
    );
  }

  return res.status(500).json(
    new apiResponse(500, "Internal server error", {}, err)
  );
});
    
};

init(); // Start initialization


const server = http.createServer(app);
export default server;