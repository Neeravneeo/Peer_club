import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  uploadDocument,
  listDocuments,
  getDocument,
  deleteDocument,
  updateDocument,
} from '../controllers/documents.controller.js';

export const documentsRouter = Router();

documentsRouter.use(requireAuth);

const uploadFlexible = (req, res, next) => {
  upload.fields([{ name: 'file', maxCount: 1 }, { name: 'document', maxCount: 1 }])(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (req.files) {
      req.file = req.files['document']?.[0] || req.files['file']?.[0];
    }
    next();
  });
};

documentsRouter.post('/', uploadFlexible, uploadDocument);
documentsRouter.get('/', listDocuments);
documentsRouter.get('/:id', getDocument);
documentsRouter.patch('/:id', updateDocument);
documentsRouter.delete('/:id', deleteDocument);
