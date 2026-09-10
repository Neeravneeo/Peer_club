import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  uploadDocument,
  listDocuments,
  getDocument,
  deleteDocument,
} from '../controllers/documents.controller.js';

export const documentsRouter = Router();

documentsRouter.use(requireAuth);

documentsRouter.post('/', upload.single('file'), uploadDocument);
documentsRouter.get('/', listDocuments);
documentsRouter.get('/:id', getDocument);
documentsRouter.delete('/:id', deleteDocument);
