import { Request, Response } from 'express';
import { aiClient } from '../services/aiClient';

export class FileController {
  public async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      const userId = req.body.userId || (req.query.userId as string);

      if (!file) {
        res.status(400).send('Please select a file to upload.');
        return;
      }

      if (!userId) {
        res.status(400).send('User ID is required.');
        return;
      }

      try {
        const response = await aiClient.uploadFile(
          userId,
          file.buffer,
          file.originalname,
          file.mimetype
        );
        res.status(200).json(response);
      } catch (e: any) {
        res.status(500).send(`File upload failed: ${e.message}`);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'File upload failed' });
    }
  }
}

export const fileController = new FileController();
