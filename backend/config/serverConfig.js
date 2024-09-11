import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './dbConfig.js';
import { connectRouter } from '../routes/index.js';
import { logger } from '../middleware/logger.js';
import { errorHandler } from '../middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import './shutdownConfig.js';
import corsOptions from './corsOptions.js';

dotenv.config();

const server = express();

//middlesware
server.use(logger); //log req
server.use(cors(corsOptions)) //cross-origin resource sharing
server.use(express.json()); //process json data
server.use(cookieParser()); //parse cookies
server.use(express.static('../public')); //serving static files

connectDB();
connectRouter(server);
server.use(errorHandler); //custom error handler

export default server;
