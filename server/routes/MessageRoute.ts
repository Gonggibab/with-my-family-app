import express, { Router } from 'express';
import { findMessagebyChatId } from '../api/message';

const router: Router = express.Router();

router.post('/findMessagebyChatId', findMessagebyChatId);

export default router;
