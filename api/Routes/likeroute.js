import express from 'express';

import { dolike, likeCount } from '../controllers/Likecontrollers.js';
import { authenticate } from '../middleware/authenticate.js';
const LikeRoute = express.Router();
LikeRoute.post('/do-like',authenticate,dolike)
LikeRoute.get('/get-like/:blogid', likeCount);


export default LikeRoute;