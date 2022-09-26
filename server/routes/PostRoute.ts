import express, { Router } from 'express';
import { upload, findPost, findByUser, deletePost } from '../api/post';

const router: Router = express.Router();

router.post('/upload', upload);
router.post('/findPost', findPost);
router.post('/findByUser', findByUser);
router.post('/deletePost', deletePost);

export default router;
