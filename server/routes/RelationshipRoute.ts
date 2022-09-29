import express, { Router } from 'express';
import {
  addRelationship,
  findRelationship,
  deleteRelationship,
} from '../api/relationship';

const router: Router = express.Router();

router.post('/addRelationship', addRelationship);
router.post('/getRelationship', findRelationship);
router.post('/deleteRelationship', deleteRelationship);

export default router;
