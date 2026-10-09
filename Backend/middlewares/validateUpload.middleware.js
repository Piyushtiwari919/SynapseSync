import { IMAGE_LIMIT } from "./multer.middleware.js";

export const validateUpload = (req, res, next) => {
  const file = req.file;

  if (!file) {
    return next();
  }

  if (file.mimetype.startsWith("image/") && file.size > IMAGE_LIMIT) {
    const error = new Error("Image size must not exceed 5 MiB.");

    error.code = "LIMIT_IMAGE_SIZE";
    return next(error);
  }

  next();
};
