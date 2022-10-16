import express, { Router } from 'express';
import { findMessagebyChatId, readMessagebyChatId } from '../api/message';

const router: Router = express.Router();

router.post('/findMessagebyChatId', findMessagebyChatId);
router.post('/readMessagebyChatId', readMessagebyChatId);

export default router;
