const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth.middleware");
const Report = require("../models/Report");

const router = express.Router();

/* MULTER SETUP */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* UPLOAD REPORT */
router.post(
  "/upload",
  auth,
  upload.single("report"),
  async (req, res) => {
    const report = await Report.create({
      userId: req.user.id,
      reportType: req.body.reportType,
      filePath: req.file.path
    });

    res.json({ message: "Report uploaded", report });
  }
);

/* GET USER REPORTS */
router.get("/", auth, async (req, res) => {
  const reports = await Report.find({ userId: req.user.id });
  res.json(reports);
});

module.exports = router;
