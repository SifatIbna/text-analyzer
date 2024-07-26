import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDatabase } from './config/database';
import logger from './config/logger';

const PORT = process.env.PORT || 3000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Server startup error:', error);
    process.exit(1);
  });