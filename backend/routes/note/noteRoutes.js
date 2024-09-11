import { Router } from 'express';
import * as notesController from '../../controllers/notesController.js';
import verifyJWT from "../../middleware/verifyJWT.js";

const router = Router();

router.use(verifyJWT);

router.route('/:id')
  .get(notesController.getNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote)

router.route('/')
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Resource Not Found' });
})
  
export default router;