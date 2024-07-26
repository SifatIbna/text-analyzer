import mongoose from 'mongoose';
import logger from '@config/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};