const router = require("express").Router();

const uploader = require("../middlewares/cloudinary.config.js");

// POST "/api/upload"
router.post("/", uploader.single("image"), (req, res, next) => {
  if (!req.file) {
    // this will happend if cloudinary rejects the image for any reason
    res.status(400).json({
      errorMessage:
        "There was a problem uploading the image. Check image format and size.",
    });
    return;
  }
  res.json({ imageUrl: req.file.path });
});

module.exports = router;
