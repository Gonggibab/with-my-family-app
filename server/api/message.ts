import { Request, Response } from 'express';
import { Error } from 'mongoose';
import MessageModel, { IMessage } from '../models/MessageModel';

// Find Message
const findMessagebyChatId = (req: Request, res: Response) => {
  console.log(req.body.data.load * 20);
  MessageModel.find({ chatId: req.body.data.chatId })
    .sort({ createdAt: -1 })
    .skip(req.body.data.chatId.load * 20)
    .limit(20)
    .exec(function (err, message) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ message });
    });
};

// Find and Count Message of a Post
const readMessagebyChatId = (req: Request, res: Response) => {
  MessageModel.updateMany(
    { chatId: req.body.data.chatId },
    {
      $pull: { haventRead: req.body.data.userId },
    },
    (err: Error, message: IMessage) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }
      return res.status(200).json({
        message,
      });
    }
  );
};

// Find recent Message
const findRecentMessagebyChatId = (req: Request, res: Response) => {
  MessageModel.findOne({ chatId: req.body.chatId })
    .sort({ createdAt: -1 })
    .exec(function (err, message) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ message });
    });
};

// Find recent Message
const countUnreadMessage = (req: Request, res: Response) => {
  MessageModel.find(
    {
      chatId: req.body.data.chatId,
      haventRead: { $in: [req.body.data.userId] },
    },
    (err: Error, messages: IMessage[]) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ messages });
    }
  );
};

export {
  findMessagebyChatId,
  readMessagebyChatId,
  findRecentMessagebyChatId,
  countUnreadMessage,
};
