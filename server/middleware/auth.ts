import { RequestHandler } from 'express';
import UserModel, { IUser } from '../models/UserModel';

// user authentication
export const auth: RequestHandler = (req, res, next) => {
  const token = req.cookies.user_auth;

  if (!token) {
    return res.status(200).json({
      isLogin: false,
    });
  }

  UserModel.findByToken(token, (err: Error, user: IUser) => {
    if (err)
      return res.status(400).json({
        err,
      });

    if (!user)
      return res.status(200).json({
        isLogin: false,
      });

    req.user = user;
    next();
  });
};
