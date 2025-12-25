import express from 'express';
import {
  createCategory,
  getCategories,
  showCategory,
  editCategory,
 deleteCategory
} from '../controllers/Categorycontrollers.js';
import { onlyAdmin } from '../middleware/onlyAdmin.js';
import { authenticate } from '../middleware/authenticate.js';

const Categoryrouter = express.Router();

Categoryrouter.post('/add',onlyAdmin, createCategory);                // Create
Categoryrouter.get('/all-category', getCategories);                  // List all
Categoryrouter.get('/show/:categoryid',onlyAdmin, showCategory);              // Read one
Categoryrouter.put('/update/:categoryid',onlyAdmin, editCategory);              // Update
Categoryrouter.delete('/delete/:categoryid',onlyAdmin, deleteCategory);         // Delete

export default Categoryrouter;
