import express, { Router } from 'express';
import { sendRequest, findRequest, deleteRequest } from '../api/familyRequest';

const router: Router = express.Router();

router.post('/sendRequest', sendRequest);
router.post('/getRequest', findRequest);
router.post('/deleteRequest', deleteRequest);

export default router;
