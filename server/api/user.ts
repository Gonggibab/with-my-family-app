import { Request, Response } from 'express';
import UserModel, { IUser } from '../models/UserModel';
import bcrpyt from 'bcrypt';

// User Register
const register = async (req: Request, res: Response) => {
  const user: IUser = new UserModel(req.body);

  user.save((err, user) => {
    if (err)
      return res.status(400).json({
        err,
      });

    return res.status(200).json({
      user,
    });
  });
};

// Check Email Duplication
const checkDuplicateEmail = async (req: Request, res: Response) => {
  UserModel.findOne({ email: req.body.email }, (err: Error, user: IUser) => {
    if (err)
      return res.status(400).json({
        err,
      });

    if (!user)
      return res.status(200).json({
        isDuplicateEmail: false,
      });

    return res.status(200).json({
      isDuplicateEmail: true,
    });
  });
};

// Login
const login = async (req: Request, res: Response) => {
  UserModel.findOne({ email: req.body.email }, (err: Error, user: IUser) => {
    if (err)
      return res.status(400).json({
        err,
      });

    if (!user) {
      return res.status(200).json({
        isLogin: false,
        message: '존재하지 않는 이메일 입니다',
      });
    }

    user.comparePassword(req.body.password, (err: Error, isMatch: boolean) => {
      if (err)
        return res.status(400).json({
          err,
        });

      if (!isMatch)
        return res.status(200).json({
          isLogin: false,
          message: '비밀번호가 틀렸습니다',
        });

      // if account exist, generate token
      user.generateToken(req.body.isRemainLogin, (err: Error, user: IUser) => {
        if (err)
          return res.status(400).json({
            err,
          });

        // store token in cookie
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
  });
};

// Authentication
const userAuth = async (req: Request, res: Response) => {
  res.status(200).json({
    isLogin: true,
    user: {
      _id: req.user._id,
      email: req.user.email,
      birthday: req.user.birthday,
      name: req.user.name,
      profile: req.user.profile,
      role: req.user.role,
    },
  });
};

// Logout
const logout = async (req: Request, res: Response) => {
  UserModel.findOneAndUpdate(
    { _id: req.user._id },
    { token: '', tokenExp: null },
    (err: Error, user: IUser) => {
      if (err)
        return res.status(400).json({
          err,
        });

      return res.status(200).json({
        isLogin: false,
        user: {
          _id: '',
          email: '',
          birthday: '',
          name: '',
          profile: '',
          role: 0,
        },
      });
    }
  );
};

// Find User
const findUser = async (req: Request, res: Response) => {
  UserModel.findOne({ _id: req.body.userId }, (err: Error, user: IUser) => {
    if (err) {
      return res.status(400).json({ err });
    }
    return res.status(200).json({ user });
  });
};

// Search User
const searchUser = async (req: Request, res: Response) => {
  UserModel.find(
    {
      $text: { $search: req.body.string },
    },
    (err: Error, user: IUser[]) => {
      if (err) {
        return res.status(400).json({ err });
      }
      return res.status(200).json({ user });
    }
  );
};

// Update User
const updateUser = async (req: Request, res: Response) => {
  UserModel.updateOne(
    { _id: req.body.userId },
    req.body.update,
    (err: Error, user: IUser[]) => {
      if (err) {
        return res.status(400).json({ err });
      }
      return res.status(200).json({ user });
    }
  );
};

// Update User Password
const updatePassword = async (req: Request, res: Response) => {
  const saltRounds = 10;
  const password = req.body.password;

  bcrpyt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      return res.status(400).json({ err });
    }

    UserModel.updateOne(
      { _id: req.user._id },
      { password: hash },
      (err: Error, user: IUser[]) => {
        if (err) {
          return res.status(400).json({ err });
        }
        return res.status(200).json({ user });
      }
    );
  });
};

// Check User Password
const checkPassword = async (req: Request, res: Response) => {
  req.user.comparePassword(
    req.body.password,
    (err: Error, isMatch: boolean) => {
      if (err)
        return res.status(400).json({
          err,
        });

      if (!isMatch)
        return res.status(200).json({
          success: false,
        });

      return res.status(200).json({
        success: true,
      });
    }
  );
};

// Delete User
const deleteUser = async (req: Request, res: Response) => {
  UserModel.deleteOne({ _id: req.user._id }, (err: Error, user: IUser[]) => {
    if (err) {
      return res.status(400).json({ err });
    }
    return res.status(200).json({
      isLogin: false,
      user: {
        _id: '',
        email: '',
        birthday: '',
        name: '',
        profile: '',
        role: 0,
      },
    });
  });
};

export {
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
};
