import { Router } from 'express';
import * as authController from '../../controllers/authController.js'
import rateLimiter from '../../middleware/rateLimiter.js'

const router = Router();

router.route('/new')
    .post(authController.createNewUser)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

router.route('/salt')
    .post(rateLimiter, authController.getSalt)

router.route('/')
    .post(rateLimiter, authController.login)



router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Resource Not Found' });
})
  
export default router;