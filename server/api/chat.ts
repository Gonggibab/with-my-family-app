import { Request, Response } from 'express';
import { Error } from 'mongoose';
import ChatModel, { IChat } from '../models/ChatModel';

// Find Chat by UserId
const findChatbyUserId = (req: Request, res: Response) => {
  ChatModel.find({ 'users.userId': { $in: [req.body.userId] } })
    .populate('users.userId')
    .exec(function (err, chat) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ chat });
    });
};

export { findChatbyUserId };
