import jwt from 'jsonwebtoken';
import { handleError } from '../helper/handleError.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
  
    if (!token) {
      return next(handleError(403, 'Unauthorized - No token provided'));
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return next(handleError(500, error.message));
  }
};