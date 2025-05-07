const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loginTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  logoutTime: Date,
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
