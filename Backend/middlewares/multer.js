import multer from "multer";

const IMAGE_LIMIT = 5 * 1024 * 1024;
const VIDEO_LIMIT = 25 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: VIDEO_LIMIT,
    files: 1,
  },

  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    if (!isImage && !isVideo) {
      const error = new Error("Only images and videos are allowed.");
      error.code = "INVALID_FILE_TYPE";
      return cb(error);
    }

    return cb(null, true);
  },
});

export { upload, IMAGE_LIMIT, VIDEO_LIMIT };
