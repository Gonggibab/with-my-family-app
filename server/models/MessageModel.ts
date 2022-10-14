import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  userId: Schema.Types.ObjectId;
  chatId: Schema.Types.ObjectId;
  message: string;
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
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
