import dotenv from 'dotenv';
import express, { Express } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import apiRoute from './routes';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from './types/websocket';
import userSocket from './sockets/userHandler';

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

const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

const onConnection = (
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  console.log(socket);
  userSocket(io, socket);
};

io.on('connection', onConnection);

httpServer.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
