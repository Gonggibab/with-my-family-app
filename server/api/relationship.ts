import { Request, Response } from 'express';
import { Error } from 'mongoose';
import RelationshipModel, { IRelationship } from '../models/RelationshipModel';

// Add Relationship
const addRelationship = async (req: Request, res: Response) => {
  const user1 = req.body.user1Id;
  const user2 = req.body.user2Id;

  RelationshipModel.find(
    { userId: user1, familyId: user2 },
    (err: Error, relationship: IRelationship) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }

      if (!relationship) {
        const relation: IRelationship = new RelationshipModel({
          userId: user1,
          familyId: user2,
        });

        relation.save((err, rel) => {
          if (err)
            return res.status(400).json({
              err,
            });

          return res.status(200).json({
            rel,
          });
        });
      }

      const relation: IRelationship = new RelationshipModel({
        userId: user2,
        familyId: user1,
      });

      relation.save((err, rel) => {
        if (err)
          return res.status(400).json({
            err,
          });

        return res.status(200).json({
          rel,
        });
      });
    }
  );
};

// Find Relationship
const findRelationship = (req: Request, res: Response) => {
  RelationshipModel.find({ userId: req.body.userId })
    .populate('familyId')
    .exec(function (err, relationship) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ relationship });
    });
};

// Find and Count Relationship
const countRelationship = (req: Request, res: Response) => {
  RelationshipModel.find({ userId: req.body.userId }).count(function (
    err,
    count
  ) {
    if (err) {
      console.log(err);
      return res.status(400).json({ err });
    }
    return res.status(200).json({ count });
  });
};

// Delete Relationship
const deleteRelationship = (req: Request, res: Response) => {
  RelationshipModel.deleteOne(
    { _id: req.body.relationId },
    (err: Error, relationship: IRelationship) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }
      return res.status(200).json({
        relationship,
      });
    }
  );
};

export {
  addRelationship,
  findRelationship,
  countRelationship,
  deleteRelationship,
};
