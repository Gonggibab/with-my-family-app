import express, { Router } from 'express';
import {
  addComment,
  findComments,
  deleteComment,
  updateComment,
} from '../api/comment';

const router: Router = express.Router();

router.post('/addComment', addComment);
router.post('/getComments', findComments);
router.post('/deleteComment', deleteComment);
router.post('/updateComment', updateComment);

export default router;
