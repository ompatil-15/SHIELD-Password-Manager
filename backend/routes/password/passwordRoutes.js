import { Router } from 'express';
import * as passwordsController from '../../controllers/passwordsController.js';
import verifyJWT from "../../middleware/verifyJWT.js";

const router = Router();

router.use(verifyJWT);

router.route('/:id')
  .get(passwordsController.getPassword)
  .patch(passwordsController.updatePassword) //patch used when we specify only the values that need to be updated
  .delete(passwordsController.deletePassword)

router.route('/')
  .get(passwordsController.getAllPasswords)
  .post(passwordsController.createNewPassword)
  
router.all('*', (req, res) => {
  res.status(404).json({ message: '404 Resource Not Found' });
})

  
export default router;