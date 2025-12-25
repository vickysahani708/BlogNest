import Blog from '../models/blog.model.js';
import { handleError } from '../helper/handleError.js';
import cloudinary from '../config/cloudinary.js';
import {encode,decode} from 'entities'
import Category from '../models/category.model.js';
// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const showBlogs = async (req, res, next) => {
  try {
    const user = req.user;
    let blog;

    if (user.role === 'admin') {
      blog = await Blog.find()
        .populate('author', 'name avatar role')
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    } else {
      blog = await Blog.find({ author: user._id })
        .populate('author', 'name avatar role')
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    }

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs', err });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const editBlog = async (req, res,next) => {
   try{
        const {blogid} =req.params
    const blog = await Blog.findById(blogid).populate('category','name')
    if(!blog){
        next(handleError(404,'Data not found'))
    }
    blog.blogContent = decode(blog.blogContent);
  
    res.status(200).json({blog});
  }  catch (err) {
    next(handleError(500,err.message));
  }
}

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);

    let featuredImage = ''; // ✅ Use let instead of const

    // Upload image if file exists
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "Nest_Blog",
        resource_type: "auto",
      });

      featuredImage = uploadResult.secure_url; // ✅ Assign the uploaded image URL
    }

    const blog = new Blog({ 
      author: data.author,
      category: data.category,
      title: data.title,
      slug: data.slug,
      featuredImage, // ✅ Use uploaded image URL
      blogContent: encode(data.blogContent),
    });

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog created successfully',
    });
    
  } catch (err) {
    next(handleError(500, err.message));
  }
};
;

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res,next) => {


    try {
    const {blogid} = req.params
    const data = JSON.parse(req.body.data);
     const blog = await Blog.findById(blogid)
     blog.category = data.category
     blog.title = data.title
     blog.slug = data.slug
     blog.blogContent = encode(data.blogContent)
    let featuredImage =blog.featuredImage; // ✅ Use let instead of const

    // Upload image if file exists
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "Nest_Blog",
        resource_type: "auto",
      });

      featuredImage = uploadResult.secure_url; // ✅ Assign the uploaded image URL
    }
     blog.featuredImage = featuredImage
     await blog.save()
   

    res.status(200).json({
      success: true,
      message: 'Blog Updated successfully',
    });

  } catch (err) {
    next(handleError(500, err.message));
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res,next) => {
   try {
    const {blogid} = req.params
    await Blog.findByIdAndDelete(blogid)
   
      res.status(200).json({
        success: true,
        message:'Bloged Deleted successfully',
     });
  } catch (err) {
    next(handleError(500,err.message));
  }
};


export const getBlog = async (req,res,next) => {
  try{
        const {slug} =req.params
    const blog = await Blog.findOne({ slug })
      .populate('author', 'name avatar role')
      .populate('category', 'name slug')
      .lean()
      .exec()
    res.status(200).json({blog});
  }  catch (err) {
    next(handleError(500,err.message));
  }
}

/// related Blogs controllers
export const getRelatedBlog = async (req,res,next) => {
  try{
        const {category,blog} =req.params
        const categoryData = await Category.findOne({slug:category})
        if (!categoryData) {
  return next(handleError(404, 'Category data not found'));
}

        const categoryId = categoryData._id
    const relatedBlog = await Blog.find({ category: categoryId, slug:{$ne:blog} }).lean().exec()
    res.status(200).json({relatedBlog});
  }  catch (err) {
    next(handleError(500,err.message));
  }
}

export const getBlogByCategory = async (req,res,next) => {
  try{
        const {category} =req.params
        const categoryData = await Category.findOne({slug:category})
        if (!categoryData) {
  return next(handleError(404, 'Category data not found'));
}

        const categoryId = categoryData._id
    const blog = await Blog.find({ category: categoryId }).populate('author', 'name avatar role')
      .populate('category', 'name slug')
      .lean()
      .exec()
    res.status(200).json({blog,categoryData});
  }  catch (err) {
    next(handleError(500,err.message));
  }
}
// Search
export const getBlogBySearch = async (req,res,next) => {
  try{
        const {q} =req.query
    const blog = await Blog.find({ title: {$regex:q,$options:'i'} }).populate('author', 'name avatar role')
      .populate('category', 'name slug')
      .lean()
      .exec()
    res.status(200).json({blog});
  }  catch (err) {
    next(handleError(500,err.message));
  }
}

export const getAllBlogs = async (req, res, next) => {
  try {
    const user = req.user;
    const blog = await Blog.find()
        .populate('author', 'name avatar role')
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .lean()
        .exec();;

  

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs', err });
  }
};