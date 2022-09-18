import { Request, Response } from 'express';
import UserModel, { IUser } from '../models/UserModel';

// Google login
const login = (req: Request, res: Response) => {
  const newUser: IUser = new UserModel(req.body);

  UserModel.findOne({ email: newUser.email }, (err: Error, user: IUser) => {
    if (err)
      return res.status(400).json({
        err,
      });

    if (!user) {
      newUser.save((err, user) => {
        if (err)
          return res.status(400).json({
            err,
          });

        newUser.generateToken(true, (err: Error, user: IUser) => {
          if (err)
            return res.status(400).json({
              err,
            });

          res
            .cookie('user_auth', user.token, {
              expires: user.tokenExp,
              httpOnly: true,
              secure: true,
            })
            .status(200)
            .json({
              isLogin: true,
              user: {
                _id: user._id,
                email: user.email,
                birthday: user.birthday,
                name: user.name,
                profile: user.profile,
                role: user.role,
              },
            });
        });
      });
    } else {
      user.generateToken(true, (err: Error, user: IUser) => {
        if (err)
          return res.status(400).json({
            err,
          });

        res
          .cookie('user_auth', user.token, {
            expires: user.tokenExp,
            httpOnly: true,
            secure: true,
          })
          .status(200)
          .json({
            isLogin: true,
            user: {
              _id: user._id,
              email: user.email,
              birthday: user.birthday,
              name: user.name,
              role: user.role,
            },
          });
      });
    }
  });
};

export { login };
