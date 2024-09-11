import { Router } from 'express';
import * as usersController from '../../controllers/usersController.js';
import verifyJWT from "../../middleware/verifyJWT.js";

const router = Router();

router.use(verifyJWT);

router.route('/:id/passwords')
  .get(usersController.getUserPasswords) 

router.route('/:id/notes')
  .get(usersController.getUserNotes) 

router.route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

router.route('/')
  .get(usersController.getAllUsers)
  // .post(usersController.createNewUser)
  
router.all('*', (req, res) => {
  res.status(404).json({ message: '404 Resource Not Found' });
})

// //route not found
// router.get('*', (req, res) => {
//   res.status(404).send(`
//       <html>
//       <head>
//           <style>
//               body {
//                   margin: 0;
//                   padding: 0;
//                   background-color: #000;
//                   color: #0f0;
//                   font-family: 'Courier New', Courier, monospace;
//                   display: flex;
//                   justify-content: center;
//                   align-items: center;
//                   height: 100vh;
//               }
//               pre {
//                   margin: 0;
//                   padding: 20px;
//               }
//           </style>
//       </head>
//       <body>
//           <pre>
//   [!] Warning: Unauthorized Access Attempt Detected!
//   =============================================
//   Error: 404 - Resource Not Found
//   IP: ${req.ip}
//   Timestamp: ${new Date().toISOString()}
//   =============================================
//   System alert: Intrusion prevention activated!
//   Tracking origin...
//   Reporting to admin...

//   Try harder next time, agent.
//           </pre>
//       </body>
//       </html>
//   `);
// });

export default router;