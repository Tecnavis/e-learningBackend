const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId, 
    },
    chat: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }


}, { timestamps: true });

module.exports = mongoose.model("Discussion", discussionSchema);