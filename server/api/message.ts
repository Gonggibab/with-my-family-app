import { Request, Response } from 'express';
import { Error } from 'mongoose';
import MessageModel, { IMessage } from '../models/MessageModel';

// Find Message
const findMessagebyChatId = (req: Request, res: Response) => {
  MessageModel.find({ chatId: req.body.chatId })
    .sort({ createdAt: 1 })
    .exec(function (err, message) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ message });
    });
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

// // Delete Message
// const deleteMessage = (req: Request, res: Response) => {
//   MessageModel.deleteOne(
//     { _id: req.body.MessageId },
//     (err: Error, Message: IMessage) => {
//       if (err) {
//         return res.status(400).json({
//           err,
//         });
//       }
//       return res.status(200).json({
//         Message,
//       });
//     }
//   );
// };

export { findMessagebyChatId, countMessage };
