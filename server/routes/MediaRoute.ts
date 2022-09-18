import express, { Router } from 'express';
import { uploadServer, uploadDB } from '../api/media';
import uploadFiles from '../middleware/mediaUpload';

const router: Router = express.Router();

router.post('/uploadServer', uploadFiles, uploadServer);
router.post('/uploadDB', uploadDB);

export default router;
