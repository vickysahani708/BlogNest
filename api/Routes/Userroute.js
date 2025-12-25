import express from 'express';
import { DeleteUser, getAllUser, getUser,updateUser } from '../controllers/Usercontrollers.js';
import upload from '../config/multer.js';
import { authenticate } from '../middleware/authenticate.js';
const UserRoute = express.Router();
UserRoute.use(authenticate)
UserRoute.get('/get-user/:userid',getUser)
UserRoute.put('/update-user/:userid', upload.single('file'), updateUser);
UserRoute.get('/get-all-user',getAllUser);
UserRoute.delete('/delete/:id',DeleteUser);


export default UserRoute