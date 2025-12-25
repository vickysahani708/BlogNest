import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    author:{
       type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    blogid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Blog'

    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },{timestamps:true}
  // adds createdAt and updatedAt fields
);
const Comment = mongoose.model('Comment', commentSchema,'Comments');
export default Comment
