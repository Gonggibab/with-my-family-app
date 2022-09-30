import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  content: string;
}

const CommentSchema = new mongoose.Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
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

const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);
export default CommentModel;
