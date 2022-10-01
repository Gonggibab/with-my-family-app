import { Request, Response } from 'express';
import mongoose from 'mongoose';
import CommentModel, { IComment } from '../models/CommentModel';

// Add Comment
const addComment = (req: Request, res: Response) => {
  const newComment: IComment = new CommentModel(req.body);
  newComment.save((err, comment) => {
    if (err)
      return res.status(400).json({
        err,
      });

    return res.status(200).json({
      comment,
    });
  });
};

// Find Comments in the Post
const findComments = (req: Request, res: Response) => {
  CommentModel.find({ postId: req.body.postId })
    .populate('userId')
    .sort({ createdAt: 1 })
    .limit(20)
    .exec(function (err, comment) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ comment });
    });
};

// Delete Comment
const deleteComment = (req: Request, res: Response) => {
  CommentModel.deleteOne(
    { _id: req.body.commentId },
    (err: Error, comment: IComment) => {
      if (err)
        return res.status(400).json({
          err,
        });

      return res.status(200).json({
        comment,
      });
    }
  );
};

// Update Comment
const updateComment = (req: Request, res: Response) => {
  CommentModel.updateOne(
    { _id: req.body.data.commentId },
    { $set: { content: req.body.data.content } },
    (err: Error, comment: IComment) => {
      if (err)
        return res.status(400).json({
          err,
        });

      console.log(comment);
      return res.status(200).json({
        comment,
      });
    }
  );
};

export { addComment, findComments, deleteComment, updateComment };
