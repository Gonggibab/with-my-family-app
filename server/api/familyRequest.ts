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
  console.log(req.body.userId);
  FamilyRequestModel.findOne(
    { requesteeId: req.body.userId },
    (err: Error, request: IFamilyRequest) => {
      if (err) {
        return res.status(400).json({ err });
      }
      return res.status(200).json({ request });
    }
  );
};

export { sendRequest, findRequest };
