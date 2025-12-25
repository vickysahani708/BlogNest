
import { handleError } from '../helper/handleError.js';
import Comment from '../models/comment.model.js'

// Create a new comment
export const addComment = async (req, res,next) => {
  try {
    const { author, blogid, comment } = req.body;
    const newComment = new Comment({ 
        author:author,
        blogid:blogid,
        comment:comment
     });
    await newComment.save();
    res.status(201).json({
        success:true,
        message:'Comment submited.',
        comment:newComment
    });
  } catch (error) {
   next(handleError(500,error.message));
  }
};

export const getComments = async(req,res,next) => {
  try{
    const { blogid } = req.params
    const comments = await Comment.find({ blogid })
  .sort({ createdAt: -1 })
  .populate('author', 'name avatar') // 👈 this will give you author's name + email
  .lean()
  .exec();

    res.status(201).json({
        comments
    });
  } catch (error) {
   next(handleError(500,error.message));
  }
}
export const commentCount = async(req,res,next) => {
  try{
    const { blogid } = req.params
    const commentCount = await Comment.countDocuments({blogid})

    res.status(201).json({
        commentCount
    });
  } catch (error) {
   next(handleError(500,error.message));
  }
}

export const getAllComments = async (req, res, next) => {
  try {
    const user = req.user;
    let comments 
    if(user.role === 'admin'){ comments = await Comment.find()
      .populate('blogid', 'title')
      .populate('author', 'name')}else{
      comments = await Comment.find({author:user._id})
      .populate('blogid', 'title').populate('author', 'name')
      }
    

    res.status(200).json({ comments })
  } catch (error) {
    console.error("Error in getAllComments:", error)  // <— print full error & stack
    next(handleError(500, error.message))
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const {commentid} = req.params
    const comments = await Comment.findByIdAndDelete(commentid)

    res.status(200).json({ success:true,
      message:'Data deleted'
     })
  } catch (error) {
    console.error("Error in getAllComments:", error)  // <— print full error & stack
    next(handleError(500, error.message))
  }
}

