const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reportType: String, // blood, xray, prescription
  filePath: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);
