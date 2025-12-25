import express from 'express';
import { registerUser, loginUser, GoogleloginUser, Logout } from '../controllers/Authcontrollers.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

//   Register a new user
router.post('/signup', registerUser);


//    Login existing user
router.post('/signin', loginUser);
router.post('/google-signin', GoogleloginUser);
router.get('/logout',authenticate, Logout);

export default router;