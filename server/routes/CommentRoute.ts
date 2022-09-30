import express, { Router } from 'express';
import { addComment, findComments, deleteComment } from '../api/comment';

const router: Router = express.Router();

router.post('/addComment', addComment);
router.post('/getComments', findComments);
router.post('/deleteComment', deleteComment);

export default router;
