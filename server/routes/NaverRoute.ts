import express, { Router } from 'express';
import { login } from '../api/naver';

const router: Router = express.Router();

router.post('/login', login);

export default router;
