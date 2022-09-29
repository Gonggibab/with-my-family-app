import mongoose, { Document, Schema } from 'mongoose';

export interface IRelationship extends Document {
  userId: Schema.Types.ObjectId;
  familyId: Schema.Types.ObjectId;
  relationship: string;
}

const RelationshipSchema = new mongoose.Schema<IRelationship>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    relationship: {
      type: String,
    },
  },
  { timestamps: true }
);

const RelationshipModel = mongoose.model<IRelationship>(
  'Relationship',
  RelationshipSchema
);
export default RelationshipModel;
