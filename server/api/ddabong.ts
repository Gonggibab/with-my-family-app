import { Request, Response } from 'express';
import { Error } from 'mongoose';
import DdabongModel, { IDdabong } from '../models/DdabongModel';

// Add Ddabong
const addDdabong = async (req: Request, res: Response) => {
  const ddabong: IDdabong = new DdabongModel({
    postId: req.body.postId,
    userId: req.body.userId,
  });

  ddabong.save((err, ddabong) => {
    if (err)
      return res.status(400).json({
        err,
      });

    return res.status(200).json({
      ddabong,
    });
  });
};

// Find Ddabong
const findDdabong = (req: Request, res: Response) => {
  DdabongModel.find({ postId: req.body.postId })
    .populate('userId')
    .sort({ createdAt: -1 })
    .exec(function (err, ddabong) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ ddabong });
    });
};

// Delete Ddabong
const deleteDdabong = (req: Request, res: Response) => {
  DdabongModel.deleteOne(
    { _id: req.body.ddabongId },
    (err: Error, ddabong: IDdabong) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }
      return res.status(200).json({
        ddabong,
      });
    }
  );
};

export { addDdabong, findDdabong, deleteDdabong };
