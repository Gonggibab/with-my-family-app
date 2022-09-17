import express, { Router } from 'express';
import {
  register,
  checkDuplicateEmail,
  login,
  userAuth,
  logout,
} from '../api/user';
import { auth } from '../middleware/auth';

const router: Router = express.Router();

router.post('/register', register);
router.post('/isDupEmail', checkDuplicateEmail);
router.post('/login', login);
router.get('/auth', auth, userAuth);
router.get('/logout', auth, logout);

export default router;
