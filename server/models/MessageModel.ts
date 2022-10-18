import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IMessage extends Document {
  userId: Schema.Types.ObjectId;
  chatId: Schema.Types.ObjectId;
  message: string;
  haventRead: string[];
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
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
