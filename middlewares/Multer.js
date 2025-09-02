import multer from "multer";

// Set storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Path where you want to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Naming the file
  },
});

export const upload = multer({ storage: storage });
