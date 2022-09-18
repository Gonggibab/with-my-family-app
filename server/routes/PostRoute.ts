import express, { Router } from 'express';
import { upload, findByUser } from '../api/post';

const router: Router = express.Router();

router.post('/upload', upload);
router.post('/findByUser', findByUser);

export default router;
