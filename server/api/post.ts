import { Request, Response } from 'express';
import mongoose from 'mongoose';
import PostModel, { IPost } from '../models/PostModel';

// User Register
const upload = (req: Request, res: Response) => {
  const post: IPost = new PostModel(req.body);

  post.save((err, post) => {
    if (err)
      return res.status(400).json({
        err,
      });

    return res.status(200).json({
      postId: post._id,
    });
  });
};

const findByUser = (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.body.userId);
  PostModel.find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(18)
    .exec(function (err, posts) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ posts });
    });
};

export { upload, findByUser };
