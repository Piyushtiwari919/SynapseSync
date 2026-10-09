import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File must not exceed 25 MiB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  if (err.code === "LIMIT_IMAGE_SIZE" || err.code === "INVALID_FILE_TYPE") {
    const status = err.code === "LIMIT_IMAGE_SIZE" ? 413 : 400;

    return res.status(status).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again.",
  });
};
