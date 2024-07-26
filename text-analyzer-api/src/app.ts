import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes';
import apiRoutes from './routes/apiRoutes';
import { errorHandler } from './middleware/errorHandler';
import logger from './config/logger';

const app = express();

// Swagger definition
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Text Analyzer API',
      version: '1.0.0',
      description: 'A simple Express Text Analyzer API',
    },
    servers: [
      {
        url: '{protocol}://{hostname}:{port}',
        variables: {
          protocol: {
            enum: ['http', 'https'],
            default: 'http'
          },
          hostname: {
            default: 'localhost'
          },
          port: {
            default: process.env.PORT || '3000'
          }
        }
      }
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler);

export default app;