import axios from 'axios';
import { Request, Response } from 'express';
import UserModel, { IUser } from '../models/UserModel';

// Naver login
const login = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const naverRes = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = {
      email: naverRes.data.response.email,
      name: naverRes.data.response.name,
      profile: naverRes.data.response.profile_image,
      role: 0,
    };

    const newUser: IUser = new UserModel(userData);

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
  } catch (err) {
    res.status(400).json({
      err,
    });
  }
};

export { login };
