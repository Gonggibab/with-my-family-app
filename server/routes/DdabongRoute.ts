import express, { Router } from 'express';
import {
  addDdabong,
  findDdabong,
  deleteDdabong,
  countDdabong,
} from '../api/ddabong';

const router: Router = express.Router();

router.post('/addDdabong', addDdabong);
router.post('/findDdabongbyPostId', findDdabong);
router.post('/deleteDdabong', deleteDdabong);
router.post('/countDdabongbyPostId', countDdabong);

export default router;
