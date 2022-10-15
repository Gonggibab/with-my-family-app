import express, { Router } from 'express';
import userRoute from './UserRoute';
import naverRoute from './NaverRoute';
import googleRoute from './GoogleRoute';
import familyRequestRoute from './FamilyRequestRoute';
import relationshipRoute from './RelationshipRoute';
import postRoute from './PostRoute';
import mediaRoute from './MediaRoute';
import commentRoute from './CommentRoute';
import ddabongRoute from './DdabongRoute';
import chatRoute from './ChatRoute';
import messageRoute from './MessageRoute';

const router: Router = express.Router();

router.use('/users', userRoute);
router.use('/naver', naverRoute);
router.use('/google', googleRoute);
router.use('/familyRequest', familyRequestRoute);
router.use('/relationShip', relationshipRoute);
router.use('/posts', postRoute);
router.use('/media', mediaRoute);
router.use('/comments', commentRoute);
router.use('/ddabong', ddabongRoute);
router.use('/chat', chatRoute);
router.use('/message', messageRoute);

export default router;
