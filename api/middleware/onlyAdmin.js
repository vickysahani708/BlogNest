import jwt from 'jsonwebtoken';
import { handleError } from '../helper/handleError.js';

export const onlyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(handleError(403, 'Unauthorized - No token provided'));
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodeToken.role !== 'admin') {
      return next(handleError(403, 'Access denied - Admins only'));
    }

    req.user = decodeToken;
    next();
  } catch (error) {
    return next(handleError(500, error.message));
  }
};