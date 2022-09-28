import mongoose, { Document, Schema } from 'mongoose';

export interface IFamilyRequest extends Document {
  requesterId: Schema.Types.ObjectId;
  requesteeId: Schema.Types.ObjectId;
}

const FamilyRequestSchema = new mongoose.Schema<IFamilyRequest>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    requesteeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const FamilyRequestModel = mongoose.model<IFamilyRequest>(
  'FamilyRequest',
  FamilyRequestSchema
);
export default FamilyRequestModel;
