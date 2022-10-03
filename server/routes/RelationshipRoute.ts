import express, { Router } from 'express';
import {
  addRelationship,
  findRelationship,
  countRelationship,
  deleteRelationship,
  updateRelationship,
} from '../api/relationship';

const router: Router = express.Router();

router.post('/addRelationship', addRelationship);
router.post('/getRelationship', findRelationship);
router.post('/countRelationship', countRelationship);
router.post('/deleteRelationship', deleteRelationship);
router.post('/updateRelationship', updateRelationship);

export default router;
