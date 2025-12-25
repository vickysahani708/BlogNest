import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    userid:{
       type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    blogid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Post'

    },

  },{timestamps:true}
  // adds createdAt and updatedAt fields
);
const Like = mongoose.model('Like', likeSchema,'like');
export default Like
