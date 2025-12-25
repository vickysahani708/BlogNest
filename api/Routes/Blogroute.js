import express from 'express';
import {
  editBlog,
  showBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getRelatedBlog,
  getBlogByCategory,
  getBlogBySearch,
  getAllBlogs
} from '../controllers/Blogcontrollers.js';
import upload from '../config/multer.js';
import { authenticate } from '../middleware/authenticate.js';

const BlogRoute = express.Router();

// GET all blogs
BlogRoute.get('/get-all',authenticate, showBlogs);

// GET single blog by ID
BlogRoute.get('/edit/:blogid',authenticate, editBlog);

// POST create new blog
BlogRoute.post('/add',authenticate,upload.single('file'), createBlog);

// PUT update blog
BlogRoute.put('/update/:blogid',authenticate,upload.single('file'), updateBlog);

// DELETE blog
BlogRoute.delete('/delete/:blogid',authenticate, deleteBlog);


//Home
BlogRoute.get('/get-blog/:slug', getBlog);
// related blog
BlogRoute.get('/get-related-blog/:category/:blog', getRelatedBlog);
BlogRoute.get('/get-blog-by-category/:category', getBlogByCategory);
// Search
BlogRoute.get('/search', getBlogBySearch);
//public
BlogRoute.get('/blogs', getAllBlogs);
export default BlogRoute;