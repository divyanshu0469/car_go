import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import featuresRoutes from './routes/features.routes.js';
import connectToMongoDB from './db/connection.js';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads ( from req.body)
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/', featuresRoutes);

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use(express.static(__dirname+"/public"));


app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`)
});