import { Request, Response } from 'express';
import { Error } from 'mongoose';
import ChatModel, { IChat } from '../models/ChatModel';

// Add Chat
const addChat = async (req: Request, res: Response) => {
  const chat: IChat = new ChatModel({
    users: [
      { userId: req.body[0], joinedAt: new Date(Date.now()) },
      { userId: req.body[1], joinedAt: new Date(Date.now()) },
    ],
  });

  chat.save((err, chats) => {
    if (err)
      return res.status(400).json({
        err,
      });

    return res.status(200).json({
      chats,
    });
  });
};

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

// Delete Chat by chat
// const deleteChat = (req: Request, res: Response) => {
//   ChatModel.deleteOne({ _id: req.body.ChatId }, (err: Error, Chat: IChat) => {
//     if (err) {
//       return res.status(400).json({
//         err,
//       });
//     }
//     return res.status(200).json({
//       Chat,
//     });
//   });
// };

// Find and Count Chat of a Post
// const countChat = (req: Request, res: Response) => {
//   ChatModel.find({ postId: req.body.postId }).count(function (err, count) {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({ err });
//     }
//     return res.status(200).json({ count });
//   });
// };

export { addChat, findChatbyUserId };
