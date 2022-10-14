import { Request, Response } from 'express';
import { Error } from 'mongoose';
import ChatModel, { IChat } from '../models/ChatModel';

// Add Chat
const addChat = async (req: Request, res: Response) => {
  console.log(req.body[0]);
  // const chat: IChat = new ChatModel(req.body.data);

  // chat.save((err, chat) => {
  //   if (err)
  //     return res.status(400).json({
  //       err,
  //     });

  //   return res.status(200).json({
  //     chat,
  //   });
  // });
};

// Find Chat by UserId
const findChatbyUserId = (req: Request, res: Response) => {
  ChatModel.find({ postId: req.body.postId })
    .populate('userId')
    .sort({ createdAt: -1 })
    .exec(function (err, Chat) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ Chat });
    });
};

// Delete Chat by chat
const deleteChat = (req: Request, res: Response) => {
  ChatModel.deleteOne({ _id: req.body.ChatId }, (err: Error, Chat: IChat) => {
    if (err) {
      return res.status(400).json({
        err,
      });
    }
    return res.status(200).json({
      Chat,
    });
  });
};

// Find and Count Chat of a Post
const countChat = (req: Request, res: Response) => {
  ChatModel.find({ postId: req.body.postId }).count(function (err, count) {
    if (err) {
      console.log(err);
      return res.status(400).json({ err });
    }
    return res.status(200).json({ count });
  });
};

export { addChat, findChatbyUserId, deleteChat, countChat };
