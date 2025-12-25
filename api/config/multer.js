import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure the folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowedFiles = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
  if (!allowedFiles.includes(file.mimetype)) {
    cb(new Error('Only images are allowed.'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });
export default upload;
