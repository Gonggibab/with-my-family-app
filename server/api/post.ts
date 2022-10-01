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

// Find Post
const findPost = async (req: Request, res: Response) => {
  PostModel.findOne({ _id: req.body.postId })
    .populate('userId')
    .exec(function (err, post) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ post });
    });
};

// Find Post by User
const findByUser = (req: Request, res: Response) => {
  PostModel.find({ userId: req.body.userId })
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

// Find and Count Post of an User
const countUserPost = (req: Request, res: Response) => {
  PostModel.find({ userId: req.body.userId }).count(function (err, count) {
    if (err) {
      console.log(err);
      return res.status(400).json({ err });
    }
    return res.status(200).json({ count });
  });
};

// Delete Post
const deletePost = (req: Request, res: Response) => {
  PostModel.deleteOne({ _id: req.body.postId }, (err: Error, post: IPost) => {
    if (err) {
      return res.status(400).json({
        err,
      });
    }
    return res.status(200).json({
      post,
    });
  });
};

// Get Recent Posts from Families
const getRecentPost = (req: Request, res: Response) => {
  PostModel.find({ userId: { $in: req.body.userIdList } })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('userId')
    .exec(function (err, posts) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ posts });
    });
};

export {
  upload,
  findPost,
  findByUser,
  countUserPost,
  deletePost,
  getRecentPost,
};
