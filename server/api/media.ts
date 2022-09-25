import { Request, Response } from 'express';
import mongoose, { Error } from 'mongoose';
// import fs from fs;
import MediaModel, { IMedia } from '../models/MediaModel';

// Upload Files into Server
const uploadServer = (req: Request, res: Response) => {
  return res.status(200).json({
    files: req.files,
  });
};

const uploadDB = (req: Request, res: Response) => {
  MediaModel.insertMany(req.body, (err, media) => {
    if (err)
      return res.status(400).json({
        err,
      });

    return res.status(200).json({
      media,
    });
  });
};

const findByPost = (req: Request, res: Response) => {
  const postId = new mongoose.Types.ObjectId(req.body.postId);
  MediaModel.find({ postId: postId }, (err: Error, media: IMedia[]) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ err });
    }
    return res.status(200).json({ media });
  });
};

export { uploadServer, uploadDB, findByPost };
