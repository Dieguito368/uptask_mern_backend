import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';
import projectRoutes from './routes/projectRoutes';

dotenv.config();

connectDB();

const app = express();

// CORS
app.use(cors(corsConfig));

// Logging
app.use(morgan('dev'));

// Leer datos de formulario
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);

export default app;