import Category from '../models/category.model.js';
import { handleError } from '../helper/handleError.js';

// @desc    Create a new category (name only)
export const createCategory = async (req, res,next) => {
  try {
    const { name, slug } = req.body;
    const category = new Category({
        name , slug
    })
    await category.save();

    res.status(200).json({
        success: true,
        message:'Category added successfully'
     });
  }  catch (err) {
    next(handleError(500,err.message));
  }
};
export const showCategory = async (req, res,next) =>{
    try{
        const {categoryid} =req.params
    const category = await Category.findById(categoryid)
    if(!category){
        next(handleError(404,'Data not found'))
    }
  
    res.status(200).json({category});
  }  catch (err) {
    next(handleError(500,err.message));
  }
}
export const editCategory = async (req, res,next) =>{
  try {
     const { name, slug } = req.body;
     const {categoryid} = req.params
      const category = await Category.findByIdAndUpdate(categoryid,{
        name,slug
      },{new:true})
    await category.save();

   res.status(200).json({
        success: true,
        message:'Category updated successfully',
        category
     });
  } catch (err) {
    next(handleError(500,err.message));
  }
     
}

//delete 
export const deleteCategory = async (req, res) => {
  try {
    const {categoryid} = req.params
    const deleted = await Category.findByIdAndDelete(categoryid)
   
      res.status(200).json({
        success: true,
        message:'Category deleted successfully',
        category
     });
  } catch (err) {
    next(handleError(500,err.message));
  }
};


// @desc    Get all categories (name and slug only)
export const getCategories = async (req, res,next) => {
  try {
    const category = await Category.find({}, 'name slug').sort({ name: 1 }).lean().exec();
  
    res.status(200).json({category});
  } catch (err) {
   next(handleError(500,err.message));
  }
};
