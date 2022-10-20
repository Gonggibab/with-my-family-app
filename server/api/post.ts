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
  PostModel.find({ userId: req.body.data.userId })
    .sort({ createdAt: -1 })
    .skip(req.body.data.load * req.body.data.size)
    .limit(req.body.data.size)
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
const getFamilyPost = (req: Request, res: Response) => {
  PostModel.find({ userId: { $in: req.body.data.userIdList } })
    .sort({ createdAt: -1 })
    .skip(req.body.data.load * req.body.data.size)
    .limit(req.body.data.size)
    .populate('userId')
    .exec(function (err, posts) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ posts });
    });
};

// Update Post
const updatePost = async (req: Request, res: Response) => {
  PostModel.updateOne(
    { _id: req.body.data.postId },
    { content: req.body.data.content },
    (err: Error, post: IPost) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }
      return res.status(200).json({
        post,
      });
    }
  );
};

export {
  upload,
  findPost,
  findByUser,
  countUserPost,
  deletePost,
  getFamilyPost,
  updatePost,
};
