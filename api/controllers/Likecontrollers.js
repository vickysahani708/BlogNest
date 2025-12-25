import mongoose from "mongoose";  // add this import
import Like from "../models/like.model.js";
import { handleError } from "../helper/handleError.js";

// Like a post or unlike if already liked
export const dolike = async (req, res, next) => {
  try {
    const { userid, blogid } = req.body;

    if (!userid || !blogid) {
      return next(handleError(400, "User ID and Blog ID are required"));
    }

    let like = await Like.findOne({ userid, blogid });

    if (!like) {
      like = await new Like({ userid, blogid }).save();
    } else {
      await Like.findByIdAndDelete(like._id);
    }

    const likecount = await Like.countDocuments({ blogid });

    res.status(200).json({ likecount });
  } catch (error) {
    console.error("Like error:", error);
    next(handleError(500, "Failed to process like/unlike action"));
  }
};

// Get like count
export const likeCount = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const { userid } = req.query;

    if (!blogid || !mongoose.Types.ObjectId.isValid(blogid)) {
      return next(handleError(400, "Invalid or missing Blog ID"));
    }

    const likecount = await Like.countDocuments({ blogid });

    let isUserliked = false;
    if (userid && mongoose.Types.ObjectId.isValid(userid)) {
      const userLikeCount = await Like.countDocuments({ blogid, userid });
      if (userLikeCount > 0) {
        isUserliked = true;
      }
    }

    res.status(200).json({ likecount, isUserliked });
  } catch (error) {
    console.error("Like count error:", error);
    next(handleError(500, "Failed to fetch like count"));
  }
};
