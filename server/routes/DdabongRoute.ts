import express, { Router } from 'express';
import { addDdabong, findDdabong, deleteDdabong } from '../api/ddabong';

const router: Router = express.Router();

router.post('/addDdabong', addDdabong);
router.post('/findDdabongbyPostId', findDdabong);
router.post('/deleteDdabong', deleteDdabong);

export default router;
