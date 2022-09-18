import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  postId?: Schema.Types.ObjectId;
  userId?: Schema.Types.ObjectId;
  filename: string;
  filePath: string;
  mimeType: string;
  originalName: string;
  size: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const mediaSchema = new mongoose.Schema<IMedia>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    filename: {
      type: String,
    },
    filePath: {
      type: String,
    },
    mimeType: {
      type: String,
    },
    originalName: {
      type: String,
    },
    size: {
      type: Number,
    },
  },
  { timestamps: true }
);

const MediaModel = mongoose.model<IMedia>('Media', mediaSchema);
export default MediaModel;
