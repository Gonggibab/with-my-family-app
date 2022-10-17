import { Request, Response } from 'express';
import { Error } from 'mongoose';
import MessageModel, { IMessage } from '../models/MessageModel';

// Find Message
const findMessagebyChatId = (req: Request, res: Response) => {
  MessageModel.find({ chatId: req.body.chatId })
    .limit(20)
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
const readMessagebyChatId = (req: Request, res: Response) => {
  MessageModel.updateMany(
    { chatId: req.body.data.chatId },
    {
      $pull: { haventRead: { userId: req.body.data.userId } },
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

export { findMessagebyChatId, readMessagebyChatId };
