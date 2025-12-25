import cloudinary from "../config/cloudinary.js";

import { handleError } from '../helper/handleError.js'
import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'

export const getUser = async (req, res, next) => {
    try {
        const { userid } = req.params
        const user = await User.findOne({ _id: userid }).lean().exec()
        if (!user) {
            next(handleError(404, 'User not found'))
        }
        res.status(200).json({
            success: true,
            message: 'User data found',
            user
        })

    } catch (err) {
        next(handleError(500, err.message));
    }

}
    
export const updateUser = async (req, res, next) => {
  try {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    const data = JSON.parse(req.body.data);
    const { userid } = req.params;
    const user = await User.findById(userid);

    if (!user) {
      return next(handleError(404, "User not found"));
    }

    // update basic fields
    user.name = data.name;
    user.email = data.email;
    user.bio = data.bio;

    // password update
    if (data.password && data.password.length >= 8) {
      const hashedPassword = bcryptjs.hashSync(data.password, 10);
      user.password = hashedPassword;
    }

    // Upload image if file exists
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "Nest_Blog",
        resource_type: "auto",
      });

      user.avatar = uploadResult.secure_url;
    }

    await user.save();

    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(200).json({
      success: true,
      message: "Profile Updated.",
      user: newUser,
    });
  } catch (err) {
    
    next(handleError(500, err.message));
  }
};

export const getAllUser = async (req,res,next) => {

  try{
       const user = await User.find().sort({createdAt:-1})
       res.status(200).json({
        success:true,
        user
       })
  } catch(error){
     next(handleError(500, err.message));
  }

}
export const DeleteUser = async (req,res,next) => {

  try{  const {id} = req.params
       const user = await User.findByIdAndDelete(id)
       res.status(200).json({
        success:true,
        message:'User deleted'
       })
  } catch(error){
     next(handleError(500, err.message));
  }

}

