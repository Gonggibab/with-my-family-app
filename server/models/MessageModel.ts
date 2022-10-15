import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  userId: Schema.Types.ObjectId;
  chatId: Schema.Types.ObjectId;
  message: string;
  haventRead: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
    message: {
      type: String,
    },
    haventRead: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
