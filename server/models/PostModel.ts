import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  userId: Schema.Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema = new mongoose.Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model<IPost>('Post', PostSchema);
export default PostModel;
