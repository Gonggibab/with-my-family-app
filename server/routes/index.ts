import express, { Router } from 'express';
import userRoute from './UserRoute';
import naverRoute from './NaverRoute';
import googleRoute from './GoogleRoute';

const router: Router = express.Router();

router.use('/users', userRoute);
router.use('/naver', naverRoute);
router.use('/google', googleRoute);

export default router;
