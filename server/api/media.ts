import { Request, Response } from 'express';
// import fs from fs;
import MediaModel, { IMedia } from '../models/MediaModel';

// Upload Files into Server
const uploadServer = (req: Request, res: Response) => {
  return res.status(200).json({
    files: req.files,
  });
};

const uploadDB = (req: Request, res: Response) => {
  const media: IMedia = new MediaModel(req.body);

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

export { uploadServer, uploadDB };
