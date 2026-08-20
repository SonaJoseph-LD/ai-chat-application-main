import { Router } from 'express';
import multer from 'multer';
import { fileController } from '../controllers/fileController';
import { optionalAuthMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});

router.post(
  '/upload',
  optionalAuthMiddleware,
  upload.single('file'),
  (req, res) => fileController.uploadFile(req, res)
);

export default router;
