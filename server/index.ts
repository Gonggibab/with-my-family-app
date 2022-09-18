import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import apiRoute from './routes';

dotenv.config();
const app: Express = express();

// Allow port 3000
app.use(cors({ origin: true, credentials: true }));
// To parse the incoming requests with JSON payloads
app.use(express.json());
// For urlencoded request
app.use(express.urlencoded({ extended: true }));
// For cookie request
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL!)
  .then(() => {
    console.log('Connected to Database');
  })
  .catch((err) => {
    console.log(err);
  });

// Connecting routes
app.use('/api', apiRoute);

app.use('/uploads', express.static('uploads'));

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
