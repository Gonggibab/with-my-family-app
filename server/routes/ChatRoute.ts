import express, { Router } from 'express';
import { findChatbyUserId } from '../api/chat';

const router: Router = express.Router();

router.post('/findChatbyUserId', findChatbyUserId);

export default router;
