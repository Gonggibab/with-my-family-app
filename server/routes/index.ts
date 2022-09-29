import express, { Router } from 'express';
import userRoute from './UserRoute';
import naverRoute from './NaverRoute';
import googleRoute from './GoogleRoute';
import postRoute from './PostRoute';
import mediaRoute from './MediaRoute';
import familyRequestRoute from './FamilyRequestRoute';
import relationshipRoute from './RelationshipRoute';

const router: Router = express.Router();

router.use('/users', userRoute);
router.use('/naver', naverRoute);
router.use('/google', googleRoute);
router.use('/familyRequest', familyRequestRoute);
router.use('/relationShip', relationshipRoute);
router.use('/posts', postRoute);
router.use('/media', mediaRoute);

export default router;
