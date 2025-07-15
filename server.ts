import server from './src';
import cluster from 'cluster'
import os from 'os'
import { config } from './config';
import dotenv from 'dotenv';
import path from "path";
import express from "express";
dotenv.config();

const port = config.PORT || 5000;
server.listen(port, () => { 
    console.log(`server started on port ${port}`);
}); 