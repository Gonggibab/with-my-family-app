import express, { Router } from 'express';
import {
  register,
  checkDuplicateEmail,
  login,
  userAuth,
  logout,
  findUser,
  searchUser,
  updateUser,
  updatePassword,
  checkPassword,
  deleteUser,
} from '../api/user';
import { auth } from '../middleware/auth';

const router: Router = express.Router();

router.post('/register', register);
router.post('/isDupEmail', checkDuplicateEmail);
router.post('/login', login);
router.get('/auth', auth, userAuth);
router.get('/logout', auth, logout);
router.post('/findUser', findUser);
router.post('/searchUser', searchUser);
router.post('/updateUser', updateUser);
router.post('/updatePassword', auth, updatePassword);
router.post('/checkPassword', auth, checkPassword);
router.get('/deleteUser', auth, deleteUser);

export default router;
