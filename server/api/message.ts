import { Request, Response } from 'express';
import { Error } from 'mongoose';
import MessageModel, { IMessage } from '../models/MessageModel';

// Add Message
const addMessage = async (req: Request, res: Response) => {
  const Message: IMessage = new MessageModel({
    postId: req.body.postId,
    userId: req.body.userId,
  });

  Message.save((err, Message) => {
    if (err)
      return res.status(400).json({
        err,
      });

    return res.status(200).json({
      Message,
    });
  });
};

// Find Message
const findMessage = (req: Request, res: Response) => {
  MessageModel.find({ postId: req.body.postId })
    .populate('userId')
    .sort({ createdAt: -1 })
    .exec(function (err, Message) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ Message });
    });
};

// Delete Message
const deleteMessage = (req: Request, res: Response) => {
  MessageModel.deleteOne(
    { _id: req.body.MessageId },
    (err: Error, Message: IMessage) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }
      return res.status(200).json({
        Message,
      });
    }
  );
};

// Find and Count Message of a Post
const countMessage = (req: Request, res: Response) => {
  MessageModel.find({ postId: req.body.postId }).count(function (err, count) {
    if (err) {
      console.log(err);
      return res.status(400).json({ err });
    }
    return res.status(200).json({ count });
  });
};

export { addMessage, findMessage, deleteMessage, countMessage };
