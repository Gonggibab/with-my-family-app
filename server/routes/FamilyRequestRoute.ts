import express, { Router } from 'express';
import { sendRequest, findRequest } from '../api/familyRequest';

const router: Router = express.Router();

router.post('/sendRequest', sendRequest);
router.post('/getRequest', findRequest);

export default router;
