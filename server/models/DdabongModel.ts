import mongoose, { Document, Schema } from 'mongoose';

export interface IDdabong extends Document {
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const DdabongSchema = new mongoose.Schema<IDdabong>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const DdabongModel = mongoose.model<IDdabong>('Ddabong', DdabongSchema);
export default DdabongModel;
