import mongoose, { Document, Schema } from 'mongoose';

export interface IChatUserData {
  userId: Schema.Types.ObjectId;
  joinedAt: Date;
}

export interface IChat extends Document {
  users: IChatUserData[];
}

const ChatSchema = new mongoose.Schema<IChat>(
  {
    users: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        joinedAt: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

const ChatModel = mongoose.model<IChat>('Chat', ChatSchema);
export default ChatModel;
