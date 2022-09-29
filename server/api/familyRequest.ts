import { Request, Response } from 'express';
import FamilyRequestModel, {
  IFamilyRequest,
} from '../models/FamilyRequestModel';

// Send Request
const sendRequest = (req: Request, res: Response) => {
  const familyRequest: IFamilyRequest = new FamilyRequestModel(req.body);
  familyRequest.save((err, request) => {
    if (err)
      return res.status(400).json({
        err,
      });

    return res.status(200).json({
      request,
    });
  });
};

// Find Request
const findRequest = (req: Request, res: Response) => {
  FamilyRequestModel.find({ requesteeId: req.body.userId })
    .populate('requesterId')
    .exec(function (err, request) {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
      return res.status(200).json({ request });
    });
};

// Find Request
const deleteRequest = (req: Request, res: Response) => {
  FamilyRequestModel.deleteOne(
    { _id: req.body.requestId },
    (err: Error, request: IFamilyRequest) => {
      if (err)
        return res.status(400).json({
          err,
        });

      return res.status(200).json({
        request,
      });
    }
  );
};

export { sendRequest, findRequest, deleteRequest };
