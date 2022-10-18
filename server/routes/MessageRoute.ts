import express, { Router } from 'express';
import {
  findMessagebyChatId,
  readMessagebyChatId,
  findRecentMessagebyChatId,
  countUnreadMessage,
} from '../api/message';

const router: Router = express.Router();

router.post('/findMessagebyChatId', findMessagebyChatId);
router.post('/readMessagebyChatId', readMessagebyChatId);
router.post('/findRecentMessagebyChatId', findRecentMessagebyChatId);
router.post('/countUnreadMessage', countUnreadMessage);

export default router;
