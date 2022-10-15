import express, { Router } from 'express';
import { addChat, findChatbyUserId } from '../api/chat';

const router: Router = express.Router();

router.post('/addChat', addChat);
router.post('/findChatbyUserId', findChatbyUserId);

export default router;
