import express, { Router } from 'express';
import {
  addComment,
  findComments,
  deleteComment,
  updateComment,
  countComment,
} from '../api/comment';

const router: Router = express.Router();

router.post('/addComment', addComment);
router.post('/getComments', findComments);
router.post('/deleteComment', deleteComment);
router.post('/updateComment', updateComment);
router.post('/countCommentbyPostId', countComment);

export default router;
