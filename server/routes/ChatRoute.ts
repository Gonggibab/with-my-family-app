import express, { Router } from 'express';
import { addChat } from '../api/chat';

const router: Router = express.Router();

router.post('/addChat', addChat);

export default router;
