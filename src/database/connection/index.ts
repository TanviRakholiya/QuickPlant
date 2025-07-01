// src/database/connection/index.ts
require('dotenv').config();
import mongoose from 'mongoose';
import { config } from '../../../config';

const dbUrl: string = config.DB_URL;

mongoose.set('strictQuery', false);

export const mongooseConnection = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('✅ Database successfully connected');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1); // Stop server if DB fails
  }
};
